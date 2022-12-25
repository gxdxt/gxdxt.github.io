---
layout  : wiki
title   : Modal로 데이터를 넘기는 방법 
summary : sheet는 눈보다 빠르다.
date    : 2022-12-25 16:28:28 +0900
updated : 2022-12-25 16:59:04 +0900
tags    : Swift Sheet Modal 
toc     : true
public  : true
parent  : 
latex   : false
---
* TOC
{:toc}


# Modal로 데이터를 넘기는 방법


# 서론
Swift로 개발하다 보면, button - sheet 조합은 빼놓을 수 없는 조합입니다.
하지만 해당 View에서 원하는 데이터가 sheet를 통해 열리는 View로 전달을 하는 경우도 왕왕 있겠죠.
예를 한 번 들어볼까요?

## 사례

제가 경험했던 사례로는, 
리스트에서 DetailView로 진입하는 것을 모달로 구현할 때
리스트에서 해당 View를 수정하는 것을 모달로 구현할 때

이렇게 있었네요!

## 장점

이런 식으로 Modal로 열게 된다면 먼저 뷰의 Depth를 늘리지 않는다는 장점이 있죠?
원래라면 계속해서 Depth가 생기고, 홈 화면으로 돌아가기 위해서는 뒤로가기 버튼을 4~5번 눌러야하는 경우도 생기니까요.

또 뭐가 있을까요?
생각해 봅시다.

하지만 중요한 건 꺾이지 않는 마음! 이 아니라, Modal이 열렸을 때 원하는 데이터가 담겨 있어야 하는 것입니다.
- 하지만 적절히 인자값을 넘기지 않는다면, 원하는 데이터들이 모달로 넘어가지 않습니다.
일반적으로 해당 뷰에 단순히 구조체를 넘겨서 뿌려주면 된다? 고 생각합니다.

```swift
        // 단어 편집
        .sheet(isPresented: $isShowingEditWordView) {
            EditWordView(word: Word)
                .presentationDetents([.medium])
        }
```

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

- 하지만 여기에 문제가 발생했습니다.
- 넘겨서 보여지는 단어가 한 박자가 느리게 나타나는 건데요,
- 문제의 원인은 바로 **sheet view가 열리는 시간이 생각보다 빠르다**는 것입니다.



# 본론

## 자주 발생하는 오류

Orgin View에서 Sheet View로 데이터를 전달해서 이를 확인할 떄,
원하는 데이터가 전달되지 않는 오류가 자주 발생합니다.

## 원인

이 원인이 바로 Sheet View가 열리는 속도가 굉장히 빠르다는 것입니다.

## 해결책

바로 전달되는 데이터를 `Binding type`으로 받는 것입니다. 
```swift
// 단어 편집
.sheet(isPresented: $isShowingEditWordView) {
	EditWordView(bindingWord: $Word)
		.presentationDetents([.medium])
}
```

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

# 결론

## 응애!

## Merry Christmas :)
