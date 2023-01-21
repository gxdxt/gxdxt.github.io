---
layout  : wiki
title   : Localization을 하면, 세계가 보인다!
summary : 
date    : 2023-01-22 02:34:17 +0900
updated : 2023-01-22 02:35:34 +0900
tags    : localization
toc     : true
public  : true
parent  : 
latex   : false
---
* TOC
{:toc}

# Localization


[WWDC 2021](https://developer.apple.com/videos/play/wwdc2021/10220/)
[정리](22.11.14)

## Strings

`Text()` with a string literal automatically looks up localized strings
- String interpolation just works
- Format types are automatically inferred in Xcode 13
	- `%lld of 10 points earned = ???` 

`LocalizedStringKey` allows you to look up localized strings in SwiftUI
- Declare localizable attributes in your custom views
```swift
Card (
	  title: "Thank you for your order",
	  subtitle: "We will notify you when your order is ready."
)
```

```swift
struct Card: View {
	var title: LocalizedStringKey
	var subtitle: LocalizedStringKey
	
	var body: some View {
		Circle()
			.fill(BackgroundStyle())
			.overlay(
				VStack(spacing: 16) {
					Text(title)
					Text(subtitle)
				}
			)
	}
}
```

- Preview multiple locales at once
```swift
struct SmotthieFavoriteButton_Previews: PreviewProvider {
	static var previews: some View {
		Group {
			SmoothieFavoriteButton(smoothie: .berryBlue)
			SmoothieFavoriteButton(smoothie: .berryBlue)
				.environment(\.locale,
							.init(identifier: "ru"))
		}
	}
}
```

`Text` and `LocalizedStringKey` now work together with the compiler to extract localizable content from source code
- Xcode can do a much better job of finding localizable content and extracting it for localization.

## Layout

Default beghaviors will handle most cases
- Most controls wrap text by default
- Support for right-to-left languages works out of the box


## Styling

Markdown allows you to style localized strings
```swift
// Smoothie.swift

Text("A refreshing blend that's a *real kick*!",
	comment: "Lemonberry smoothie description")
```

```swift
// Shared/Resources/ko.lproj/Localizable.strings

/* Lemonberry smoothie description */
"A refreshing blend that's a *real kick*!" = 
"*진짜 충격적인* 상쾌한 블랜드"
```

this support exists in foundation


## Formatting

New formatting API works with `Text` and `TextField` for more declarative code

```swift
let calories = Measurement<UnitEnergy>(
	value: nutritionFact.kilocalories, unit: .kilocalories)
	
static let measurementFormatter: MeasurementFormatter = {
	let formatter = MeasurementFormatter()
	formatter.unitStyle = .long
	formatter.unitOptions = .providedUnit
	return formatter
}()

Text(Self.measurementFormmater.string(from: .calories))

Text("Energy: \(calories, formatter: Self.measurementFormatter)")
```

In the past, we had to create a measurement formatter
But now,

We can specify the format in a declarative manner directly inline with where the value is being shown.

```swift
let calories = Measurement<UnitEnergy>(
	value: nutritionFact.kilocalories, unit: .kilocalories)
	
Text(calories, formatted(.measurement(width: .wide, usage: .food)))

Text("Energy: \(calories, format: .measurement(width: .wide, usage: .food))")
```

## Keyboards Shortcuts

## Exporting for translation

1. Go to the project in the project navigator.
2. Choose "The Voca" in the project editor.
3. Add a localization under the Info tab.
4. in SwiftUI, make sure that the build setting "Use Compiler to Extract Swift Strings" is set to "YES"
5. When We export for localization, Xcode will build all the targets in our project and use the compiler type information to extract LocalizedStringKeys from SwiftUI code.
	1. Before exporting, We can use pseudolanguages in SwiftUI Previews to see which strings are localizable and which we've missed.
	2. Go to the scheme editor, click App Language under the Options tab
	3. Choose Accented Pseudolanguage.
6. Make the custom view's variables localizable
	1. Use LocalizedStringKey
	2. Use Stringsdict (make sure it handels plurals properly)

> Starting in Xcode 12.5, We can export and import localizations for projects and workspaces in the Product menu.


# 서론
다른 프로그래밍 언어를 공부하면서 한 번도 생각해보지 않은 것. 
하지만 자연스런 앱

# 본론

1. Localizable.strings 파일 생성
2. Localizable한 String들을 먼저 정리
3. Project > Info > Localizations 에 필요한 언어들 추가
4. Localizable.strings에 번역 작성
5. Edit Scheme 통해서 Simulator 언어 변경하여 테스트

- Trouble Shooting
[troubles about localization](23.01.18)

- validation failed: Couldn't parse property list because the input data was in an invalid format
	- ;
- enum localization
```swift
enum ProfileSection : String, CaseIterable {
    case normal = "전체 보기"
    case wordTest = "단어 가리기"
    case meaningTest = "뜻 가리기"
    
    func localizedString() -> String {
            return NSLocalizedString(self.rawValue, comment: "")
    }
}
```

```swift
Picker("", selection: $selectedSegment) {
	ForEach(ProfileSection.allCases, id: \.self) { option in
		Text(option.localizedString())
	
```

- 삼항 연산자 localizing?
	- The problem is due to type inference. You have to declare `myString` to be of type `LocalizedStringKey` and then everything will work as expected.
	- Text(selectedSegment == .normal ? " " : selectedSegment == .wordTest ? "\(Image(systemName: "exclamationmark.circle")) \(wordTest)" : "\(Image(systemName: "exclamationmark.circle")) \(meaningTest)")

- System default는 영어라 코드 입력이 한국어로 되어있어도,
- Korean을 언어에 추가해줘야 한다?
- unrecognized selector sent to instance?
	- 

# 결론

- 세계로 향하는 앱을 위해선 Localization이 필수!!
