---
layout  : wiki
title   : Accessibility 
summary :
date    : 2022-12-10 22:56:29 +0900
updated : 2019-11-04 22:13:47 +0900
tag     : HIG 
resource: 7C/C3DE70-9283-43F3-BF44-0CD01F2D08B6
toc     : true
public  : true
parent  : [[hig]]
latex   : true
---
* TOC
{:toc}


> People use Apple’s accessibility features to personalize how they interact with their devices in ways that work for them.

> 사람들은 그들이 본인에게 맞는 방식으로 자신의 기기와 상호작용하는 방법을 개인화하기 위해 애플의 접근성 특징들을 사용합니다.

## Best Practices

- **Design with accessibility in mind.**
	- 접근 가능성을 고려한 디자인
- **Simplicity**
	- 간단함
- **Perceivability**
	- 지각 가능성
- **Support personalization.**
	- 개인화 지원
- **Audit and test your app or game for accessibility.**
	- 접근 가능성을 위한 당신의 앱과 게임을 심사하고 테스트

## Interactions
- 상호작용

### Gestures
- 제스처

- **Don’t override the platform gestures.**
	- 그 플랫폼의 제스처를 기능을 따로 추가하면 안됩니다.
- **Prefer simplified gestures for common interactions.**
	- 공통의 상호작용을 위한 것을은 간단한 제스처를 선호해야 합니다.
- **Provide alternative ways to perform gesture-based actions.**
	- 제스처 기반의 액션들을 수행을 대체하는 또 다른 방법들을 제공해야 합니다.
- **When possible, make your app’s core functionality accessible through more than one type of physical interaction.**
	- 가능하다면, 당신의 앱의 주요 기능을 한 가지 타입 이상의 신체적 상호작용으로 접근할 수 있도록 해야합니다.
- **Make drag and drop accessible in your iOS or iPadOS app.**
	- 드래그 앤 드랍을 당신의 iOS iPadOS 앱에서 가능하도록 해야합니다.

### Buttons and controls
- 버튼들과 컨트롤

- **Give all touchscreen controls and interactive elements a hit target that measures at least 44x44 pt.**
	- 최소 44x44 크기의 히트 타겟을 모든 터치 스크린 컨트롤들과 상호작용 요소들에게 부여해야 합니다.
- **Characterize the accessibility of custom elements.**
	- 커스텀된 요소들의 접근 가능성을 특징화해야 합니다.
- **Use a consistent style hierarchy to communicate the relative importance of buttons.**
	- 버튼들의 상대적 중요도를 안내하기 위한 일관된 스타일 계층화를 사용해야 합니다.
- **Prefer the system-provided switch component.**
	- 시스템이 제공하는 스위치 요소를 선호해야 합니다.
- **Consider giving links a visual indicator in addition to color, such as an underline.**
	- 링크들에게 색상 외에 밑줄과 같은 시각적 표시를 제공하는 것을 고려하세요.

### User input
- 사용자 입력

- **Let people input information by speaking instead of typing.**
	- 직접 타이핑하는 것 대신에 말로 사용자들이 정보를 입력할 수 있게 해야 합니다.
- **Support Siri or Shortcuts for performing important tasks by voice alone.**
	- 목소리만으로 주요 업무를 수행할 수 있도록 시리 혹은 숏컷들을 지원해야 합니다.
- **When possible, don’t prevent people from selecting plain text.**
	- 가능하다면, 사용자들이 공백을 선택하는 것을 막으면 안됩니다.

### Haptics
- 진동

- **Support the system-defined haptics.**
	- 시스템이 규정한 햅틱들을 지원해야 합니다.

## VoiceOver
- 보이스 오버

### Content descriptions
- 컨텐츠 설명

- **Provide alternative descriptions for all images that convey meaning.**
	- 의미를 전달하는 모든 이미지들의 대체 설명들을 제공해야 합니다.
- **Make infographics fully accessible.**
	- infographics
	- 충분히 접근 가능한 인포그래픽들을 만들어야 합니다.
- **When an image is purely decorative and isn't intended to communicate anything, hide it from assistive technologies.**
	- assistive techonologies
	- 한 이미지가 순전히 꾸미는 목적이고 전달하는 요소가 없다면, 지원 기능으로부터 숨겨야 합니다.
- **Give each screen a unique title and provide headings that identify sections in your information hierarchy.**
	- information hierarchy
	- 각 스크린 별로 유일한 제목을 부여하고, 정보 계층의 구분을 확인할 수 있는 머릿말을 제공해야 합니다.
- **Help everyone enjoy your video and audio content.**
	- 모든 사람들이 영상과 음성 컨텐츠를 즐길 수 있도록 도와주어야 합니다.

### Navigation
- 네비게이션

- **Make sure VoiceOver users can navigate to every element.**
	- 보이스 오버를 사용하는 사용자가 앱의 모든 요소들에 접근할 수 있도록 해야합니다.
- **Improve the VoiceOver experience by specifying how elements should be grouped, ordered, or linked.**
	- 요소들이 어떻게 그룹되었고, 정렬되었고, 연결되어 있느지 명확히 하면서 보이스 오버 경험을 향상시켜야 합니다.
- **Tell VoiceOver when onscreen content or layout changes.**
	- 온스크린 요소 혹은 레이아웃이 변경됐을 때, 보이스오버에 이야기 해야합니다.
- **Help people predict when a control opens a different webpage or app.**
	- controls
	- 사용자들이 컨트롤이 다른 웹 페이지나 앱을 열었을 때 이를 예상할 수 있도록 도와주어야 합니다.
- **Provide alternative text labels for all important interface elements.**
	- 모든 중요 인터페이스 요소들에 대체되는 텍스트 라벨을 제공해야 합니다.
- **Support the VoiceOver rotor when necessary.**
	- the VoiceOver rotor
	- 보이스오버 로터를 필요할 때 사용할 수 있도록 지원해야 합니다.
- **In iPadOS and macOS, make sure people can use the keyboard to navigate and interact with all onscreen components in your app.**
	- navigate
	- iPadOS와 MacOS에서 당신의 앱의 모든 화면 요소들과 상호작용 하고 키보드를 움직여 사용할 수 있도록 해주어야 합니다.

## Text display
- 텍스트 화면

- **In iOS, iPadOS, tvOS, and watchOS, use Dynamic Type and test that your app’s layout adapts to all font sizes.**
	- 모든 OS에서 다이나믹 타입을 사용하고 모든 폰트 사이즈들이 앱의 레이아웃에 적용되는지 테스트해야 합니다.
- **As font size increases, keep text truncation to a minimum.**
	- 폰트 사이즈가 커지면, 텍스트 잘림 현상을 최소화 해야합니다.
- **Consider adjusting layout at large font sizes.**
	- 큰 폰트 사이즈에는 레이아웃을 조절하는 것을 고려해야 합니다.
- **Increase the size of meaningful interface icons as font size increases.**
	- 폰트 사이즈가 커지면 의미있는 인터페이스 아이콘들의 사이즈도 커져야 합니다.
- **Maintain a consistent information hierarchy regardless of the current font size.**
	- 현재 폰트 사이즈와 관계 없이 일관된 정보 계층을 유지해야 합니다.
	- 
- **Prefer regular or heavy font weights in your app.**
	- regular 혹은 heavy 폰트 두께를 선호해야 합니다.
- **Ensure your app responds correctly and looks good when people enable bold text.**
	- 앱이 올바르게 응답하고 사람들이 볼드체 텍스트를 사용했을 때 이쁘게 보여야 합니다.
- **Make sure custom fonts are legible.**
	- 커스텀 폰트가 읽을 수 있도록 해야합니다.
- **Avoid full text justification.**
	- 전체 텍스트를 정의하는 것을 피해야 합니다.
- **Avoid using italics or all caps for long passages of text.**
	- 긴 글에 대해 이탤릭체를 사용하거나 대문자를 사용하는 것을 피해야 합니다.

## Color and effects
- 색상과 효과

- **Don’t rely solely on color to differentiate between objects or communicate important information.**
	- 요소들끼리의 차이를 보여주거나, 혹은 중요 정보를 전달하는 데에 색상에만 의존해서는 안됩니다.
- **Prefer system colors for text.**
	- 텍스트에는 시스템 제공 색상을 선호해야 합니다.
- **Avoid using color combinations as the only way to distinguish between two states or values.**
	- 두 상태 및 값 끼리의 구별을 위한 유일한 방법으로 색상 조합을 사용하는 것을 피해야 합니다.
- **Ensure your views respond correctly to Invert Colors.**
	- 뷰들이 색상 반전을 했을 때 올바르게 반영되어야 합니다.
- **Use strongly contrasting colors to improve readability.**
	- 가독성을 증가시키기 위해 강력한 대비색을 사용해야 합니다.
- **Avoid requiring animations unless they’re essential for your experience.**
	- UX에 필수적으로 필요하지 않은 애니메이션은 피해야 합니다.
- **Play tightened animations when Reduce Motion is on.**
	- Reduce Motion
	- Reduce Motion이 켜져 있을 때, 최소한의 애니메이션이 동작해야 합니다.
- **Let people control video and other motion effects.**
	- 사용자들이 비디오와 다른 모션 이펙트를 통제할 수 있도록 해야합니다.
- **Be cautious when displaying moving or blinking elements.**
	- 움직이거나 깜빡이는 요소를 보여줄 때에는 조심해야 합니다.
- **Change blurring and transparency when people turn on Reduce Transparency.**
	- 상요자들이 투명도를 제거한다고 설정했을 때, 흐림과 투명도를 바꿔야 합니다.
