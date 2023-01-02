---
layout  : wiki
title   : Dark Mode
summary : 
date    : 2023-01-02 09:43:57 +0900
updated : 2023-01-02 09:45:12 +0900
tags    : hig 
toc     : true
public  : true
parent  : [[/hig]]
latex   : false
---
* TOC
{:toc}

# Dark Mode

> Dark Mode is a systemwide appearance setting that uses a dark color palette to provide a comfortable viewing experience tailored for low-light environments.

> 다크 모드는 저-조도 환경에 알맞는 편안한 시청 경험을 제공하는 다크 컬러 팔레트를 사용한 시스템 전반적인 미적 설정입니다.

## Best practices

- **Avoid offering an app-specific appearance setting.**
	- 앱의 특별한 미적 설정 제공하는 것은 피해야 합니다.
- **Ensure that your app looks good in both appearance modes.**
	- 라이트 모드, 다크 모드 모두에서 당신의 앱이 보기 좋아야 합니다.
- **Test your content to make sure that it remains comfortably legible in both appearance modes.**
	- 라이트 모드, 다크 모드 모두에서 당신의 컨텐츠들이 편안히 읽을 수 있도록 테스트 해야합니다.
- **In rare cases, consider using only a dark appearance in the interface.**
	- 희귀한 경우에, 다크 모드만 해당 인터페이스에서 사용하는 것도 고려해야 합니다.

## Dark Mode colors
- 다크 모드 색상

- **Embrace colors that adapt to the current appearance.**
	- 현재 appearance에 알맞는 색상들을 포함해야 합니다.
- **Aim for sufficient color contrast in all appearances.**
	- 모든 appearances에 충분한 대비색을 노려야 합니다
	- ?
- **Soften the color of white backgrounds.**
	- 흰 배경들의 색상들을 soften 해야 합니다.
	- ?

### Icons and images
- 아이콘과 이미지

- **Use SF Symbols wherever possible.**
	- 가능하면 최대한 SF Symbols를 사용해야 합니다.
- **Design separate interface icons for light and dark appearances if necessary.**
	- 필요하다면 라이트 모드와 다크 모드를 위한 인터페이스 아이콘을 분리하여 디자인해야 합니다.
- **Make sure full-color images and icons look good in both appearances.**
	- 모든 모드들에서 풀 컬러 이미지들과 아이콘들이 잘 보여야 합니다.

### Text
- 텍스트

- **Use the system-provided label colors for labels.**
	- 라벨들을 위해 시스템에서 제공되는 라벨 색상들을 사용해야 합니다.
- **Use system views to draw text fields and text views.**
	- 텍스트 필드와 텍스트 뷰를 그리는 시스템 뷰들을 사용해야 합니다.

## Platform considerations
- 플랫폼 별 고려사항

### iOS, iPadOS

- **Prefer the system background colors.**
	- 시스템 배경색들을 선호해야 합니다.

### macOS

- **Include some transparency in custom component backgrounds when appropriate.**
	- 커스텀 요소 배경들이 잘 어울린다면 약간의 투명도를 포함해도 됩니다.

