---
layout  : wiki
title   : Modal로 데이터를 넘기는 방법 
summary : sheet는 눈보다 빠르다.
date    : 2022-12-25 16:28:28 +0900
updated : 2022-12-26 17:49:20 +0900
tags    : Swift Sheet Modal 
toc     : true
public  : true
parent  : 
latex   : false
---
* TOC
{:toc}

Modal 창을 통해 필요한 데이터를 불러올 때, 문제가 발생했습니다.
Swift 에선 `.sheet`라는 modifier를 통해 하단에서 Modal 창이 나타납니다.
보통 List 안에 요소를 클릭해서 해당 리스트 element를 sheet에 전달했는데, 원하는 element가 전달되지 않는 문제가 발생했습니다!


# 서론
Swift로 개발하다 보면, button - sheet 조합은 빼놓을 수 없는 조합입니다.
하지만 해당 View에서 원하는 데이터가 sheet를 통해 열리는 View로 전달을 하는 경우도 왕왕 있겠죠.
예를 한 번 들어볼까요?

## 사례

제가 경험했던 사례로는, 
리스트에서 DetailView로 진입하는 것을 모달로 구현할 때
리스트에서 해당 요소의 데이터를 수정하는 뷰를 모달로 구현할 때

이렇게 있었네요!

## 장점

이런 식으로 Modal로 열게 된다면 먼저 뷰의 Depth를 늘리지 않는다는 장점이 있죠? (~~무한 뒤로가기 버튼을 방지할 수 있죠!~~)
원래라면 계속해서 Depth가 생기고, 홈 화면으로 돌아가기 위해서는 뒤로가기 버튼을 4~5번 눌러야하는 경우도 생기니까요.


하지만 중요한 건 꺾이지 않는 마음! 이 아니라, Modal이 열렸을 때 원하는 데이터가 담겨 있어야 하는 것입니다.
- 하지만 적절히 인자값을 넘기지 않는다면, 원하는 데이터들이 모달로 넘어가지 않습니다.
일반적으로 해당 뷰에 단순히 커스텀 구조체를 넘겨서 뿌려주면 된다? 고 생각합니다.

예시 코드를 한 번 볼까요?

```swift
        // 단어 편집
        .sheet(isPresented: $isShowingEditWordView) {
            EditWordView(word: Word)
                .presentationDetents([.medium])
        }
```

위 코드는 뷰 이름을 보아 미루어 짐작하건데, `Word` 구조체를 넘겨주고, 이름이 `EditWordView`인 것으로 보아 어떤 단어를 수정하는 뷰를 `sheet`로 열게되는 코드인 것 같네요.

```swift
struct EditWordView: View {
    var word: Word
    
    @State private var isContinue: Bool = false
    
    @State private var inputWord: String = ""
    @State private var inputOption: String = ""
    @State private var inputMeaning: String = ""
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("단어")) {
                    TextField("단어를 입력하세요.", text: $inputWord)
                }
                
                switch vocabulary.nationality {
                case "JP":
                    Section(header: Text("발음")) {
                        TextField("발음을 입력하세요.", text: $inputOption)
                    }
                case "FR":
                    Section(header: Text("성별")) {
                        Picker("성별", selection: $inputOption) {
                            Text("남성형").tag("m")
                            Text("여성형").tag("f")
                        }
                        .pickerStyle(.segmented)
                    }
                default:
                    Text("")
                }
                Section(header: Text("뜻")) {
                    TextField("뜻을 입력하세요.", text: $inputMeaning)
                }
            }
            .onAppear(perform: {
                inputWord = bindingWord.word!
                inputOption = bindingWord.option ?? ""
                inputMeaning = bindingWord.meaning!
            })
    }
```

수정을 위한 뷰는 다음과 같이 구성했습니다.

- 하지만 여기에 문제가 발생했습니다.
- 넘겨서 보여지는 단어가 한 박자가 느리게 나타나는 건데요,

> 문제의 원인은 바로 **sheet view가 열리는 시간이 생각보다 빠르다**는 것입니다.



# 본론

## 자주 발생하는 오류

Orgin View에서 Sheet View로 데이터를 전달해서 이를 확인할 떄,
원하는 데이터가 전달되지 않는 오류가 자주 발생합니다.

## 원인

이 원인이 바로 앞서 이야기한, `Sheet View`가 열리는 속도가 굉장히 빠르다는 것입니다.

> You have to use `sheet(item:)` to get the behavior you're looking for. In iOS 14, the `sheet` view is calculated before the @State changes:
> 출처: https://stackoverflow.com/questions/66936406/passing-parameter-to-a-swiftui-sheet



## 해결책

### 나의 해결책

> 바로 전달되는 데이터를 `Binding type`으로 받는 것입니다. 

```swift
// 단어 편집
.sheet(isPresented: $isShowingEditWordView) {
	EditWordView(bindingWord: $Word)
		.presentationDetents([.medium])
}
```

전달해주는 데이터 타입이 이제 `Binding<Word>`로 변경된 것을 확인할 수 있습니다.

```swift
struct EditWordView: View {
    @Binding var bindingWord: Word // Binding으로 변경!
    
    (...)
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("단어")) {
                    TextField("단어를 입력하세요.", text: $inputWord)
                }
                
                switch vocabulary.nationality {
                case "JP":
                    Section(header: Text("발음")) {
                        TextField("발음을 입력하세요.", text: $inputOption)
                    }
                case "FR":
                    Section(header: Text("성별")) {
                        Picker("성별", selection: $inputOption) {
                            Text("남성형").tag("m")
                            Text("여성형").tag("f")
                        }
                        .pickerStyle(.segmented)
                    }
                default:
                    Text("")
                }
                Section(header: Text("뜻")) {
                    TextField("뜻을 입력하세요.", text: $inputMeaning)
                }
            }
            .onAppear(perform: {
                inputWord = bindingWord.word!
                inputOption = bindingWord.option ?? ""
                inputMeaning = bindingWord.meaning!
            })
    }
```

### 또 다른 해결책

- `.sheet(item: )` overloading

공식 문서를 읽어보니, 이 방법이 사실은 정석인 것으로 판단되네요!
나중에는 overloading된 위 modifier를 통해 맞닥드렸던 문제를 해결해봐야겠어요.



# 결론

- '각각 기능들에 대한 버전 정보'
- '각각 기능들의 Swift 자체적인 우선순위'
- 위 요소들도 코딩 과정에서 충분히 신경써야 하는 것임을 알게 되었습니다.

> Merry Christmas :)
