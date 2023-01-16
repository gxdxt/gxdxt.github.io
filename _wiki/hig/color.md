---
layout  : wiki
title   : Color
summary : 
date    : 2022-12-28 00:09:01 +0900
updated : 2023-01-16 21:53:39 +0900
tags    : hig 
toc     : true
public  : true
parent  : [[/hig]] 
latex   : false
---
* TOC
{:toc}

# Color

> Judicious use of color can enhance communication, evoke your brand, provide visual continuity, communicate status and feedback, and help people understand information.

> 신중한 색상의 사용은 의사소통을 강화하고, 브랜드를 각인시키고, 시각적 지속성을 제공하고, 상태와 피드백을 주고 받고 사람들이 정보를 이해하는 것을 도울 수 있습니다.

## Check List

- [ ] 화면에 전달하는 메시지가 색상으로 인해 희석되지 않나요?
- [ ] 색상을 사용하는 곳이 중요한 정보를 전달하고 있나요?
- [ ] 같은 색상을 사용하는 요소가 같은 의미를 가지고 있나요?
- [ ] 다크모드 / 라이트모드에서 색상 변경이 잘 동작하나요?
- [ ] 여러 디스플레이 환경에서 의도한 색상이 나오는지 테스트했나요?
- [ ] 의도한 색상이 주변 요소들에 의해 변할 수 있는 것을 고려했나요?
- [ ] 사용자들에게 색상을 선택할 수 있는 권한을 주었나요?
	- [ ] 시스템에서 제공하는 컬러만 선택할 수 있도록 하였나요?




## Best Practices

- **Use color sparingly in nongame apps.**
	- 게임이 아닌 앱에선 보조의 용도로 색상을 사용해야 합니다.
- **Avoid using the same color to mean different things.**
	- 다른 의미의 요소들에 같은 색상을 사용하는 것은 피해야 합니다.
- **Make sure your app’s colors work well in both light and dark appearance modes.**
	- 밝은 화면, 다크 모드 둘 다 선택한 앱의 색상이 잘 동작하는 것을 확인해야 합니다.
- **Test your app’s color scheme under a variety of lighting conditions.**
	- 다양한 빛 환경에서 당신의 앱 색상들을 테스트해야 합니다.
- **Test your app on devices with different displays.**
	- 다른 디스플레이들의 기기에서 당신의 앱을 테스트해야 합니다.
- **Consider how artwork and translucency affect nearby colors.**
	- 아트워크와 반투명이 주변 색상들에 어떻게 영향을 주는지 생각해야 합니다.
- **If your app lets people choose colors, prefer system-provided color controls where available.**
	- 만약 앱에서 사람들이 색상들을 선택할 수 있다면, 가능한 곳에서는 시스템 제공 컨트롤을 선호해야 합니다.

## Inclusive color
포괄적 색상

- **Avoid relying solely on color to differentiate between objects, indicate interactivity, or communicate essential information.**
	- 객체들 사이의 차이를 오로지 색상으로만 두는 것을 피하고, 상호작용을 명시하거나 필수적 정보들을 전달해야 합니다.
- **Avoid using colors that make it hard to perceive content in your app.**
	- 앱에 내용을 인식하기 어렵게 만드는 색상 사용을 피해야 합니다.
- **Consider how the colors you use might be perceived in other countries and cultures.**
	- 다른 나라와 문화들에서 당신이 사용한 색상을 어떻게 받아드릴지 고려해야 합니다.

## System colors
시스템 색상

- **Avoid hard-coding system color values in your app.**
	- 앱에서 하드 코딩 시스템 색상값 사용을 피해야 합니다.
- **Avoid replicating dynamic system colors.**
	- 동적 시스템 색상들을 복제하는 것을 피해야 합니다.
	- ?
- **Avoid redefining the semantic meanings of dynamic system colors.**
	- 동적 시스템 색상들의 의미론적 뜻을 재정의하는 것을 피해야 합니다.
	- ?

## Color management
색상 관리

- **Apply color profiles to your images.**
	- 이미지들에 색상 프로파일을 적용해야 합니다.
- **Use wide color to enhance the visual experience on compatible displays.**
	- 호환 디스플레이들에서 시각 효과를 강화하기 위해 넓은 색상을 사용해야 합니다.
- **Provide color space–specific image and color variations if necessary.**
	- 필요하다면 색상 공간-특정 이미지와 색상 변형을 제공해야 합니다.
