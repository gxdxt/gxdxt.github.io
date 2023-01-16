---
layout  : wiki
title   : Icon
summary : 
date    : 2023-01-14 00:29:40 +0900
updated : 2023-01-16 21:52:57 +0900
tags    : hig 
toc     : true
public  : true
parent  : [[/hig]] 
latex   : false
---
* TOC
{:toc}

# ICON

> An effective icon is a graphic asset that expresses a single concept in ways people instantly understand.

> 효과적인 아이콘은 그래픽 에셋으로, 사람들이 즉각적으로 이해하는 방식으로 하나의 개념을 표현합니다.

## Check List

- [ ] 인식하기 쉽고 간단한가요?
- [ ] 다른 아이콘들과 일관성을 갖고 있나요?
- [ ] 인접한 텍스트들과 글씨 두께가 맞춰졌나요?
- [ ] 아이콘에 패딩을 더했나요?
	- [ ] 시각적 정렬이 필요한 상황인가요?
- [ ] 선택될 수 있는 아이콘인가요?
	- [ ] 선택된 상태 버전이 제공되나요?
- [ ] 포괄적인 디자인으로 되어있나요?
- [ ] 아이콘에 텍스트가 포함되어 있나요?
	- [ ] 의미 전달을 위해 필수적인 텍스트 인가요?
- [ ] 아이콘을 직접 만들었나요?
	- [ ] 벡터 형태를 사용했나요?
- [ ] 아이콘에 대한 대체 텍스트 라벨을 제공했나요?


## Best Practices

- **Create a recognizable, highly simplified design.**
	- 인식할 수 있고, 매우 간단한 디자인을 만드세요.
- **Maintain visual consistency across all interface icons in your app.**
	- 앱에 있는 모든 아이콘들은 시각적 일관성을 유지해야 합니다.
- **In general, match the weights of interface icons and adjacent text.**
	- 대체로, 아이콘과 인접한 텍스트들의 weights를 맞춰야 합니다.
- **If necessary, add padding to a custom interface icon to achieve optical alignment.**
	- 필요하다면 시각적 정렬을 위해 커스텀된 인터페이스 아이콘에 패딩을 더해도 됩니다.
- **Provide a selected-state version of an interface icon only if necessary.**
	- 필요한 경우에만 인터페이스 아이콘의 선택된 상태 버전을 제공해야 합니다.
- **Create inclusive designs.**
	- 포괄적인 디자인을 만드세요.
- **Include text in your design only when it’s essential for conveying meaning.**
	- 의미 전달을 위해 필수적일 때에만 디자인에 텍스트를 포함하세요.
- **If you create a custom interface icon, use a vector format like PDF or SVG.**
	- 만약 직접 인터페이스 아이콘을 만든다면, PDF 혹은 SVG와 같은 벡터 형태를 사용하세요.
- **Provide alternative text labels for custom interface icons.**
	- 만들어진 인터페이스 아이콘들을 위한 대체 텍스트 라벨을 제공하세요.
- **Avoid using replicas of Apple hardware products.**
	- 애플 하드웨어 제품의 복제품 사용을 피해야 합니다.

## Platform considerations

### macOS

#### Document icons
- 문서 아이콘들

- **Design simple images that clearly communicate the document type.**
	- 명확히 해당 문서 타입을 전달하는 간단한 이미지를 디자인 하세요.
- **Designing a single, expressive image for the background fill can be a great way to help people understand and recognize a document type.**
	- 배경을 채우기 위한 단일, 표현 이미지를 디자인하는 것은 사람들이 문서 타입을 이해하고 인지하는 좋은 방법이 될 수 있습니다.
- **Consider reducing complexity in the small versions of your document icon.**
	- 당신의 문서 아이콘의 작은 버전의 복잡도를 줄이는 것을 고려하세요.
- **Avoid placing important content in the top-right corner of your background fill.**
	- 배경 우측 상단에 중요한 요소를 놓지 마세요.
- **If a familiar object can convey a document’s type or its connection with your app, consider creating a center image that depicts it.**
	- 만약 익숙한 객체가 문서의 타입 혹은 앱과의 연결을 전달하면, 이를 묘사하는 중앙의 이미지를 만드세요.
- **Define a margin that measures about 10% of the image canvas and keep most of the image within it.**
	- 이미지 크기의 약 10프로 여백을 정의하고 해당 범위 내에 이미지들을 유지하세요.
- **Specify a succinct term if it helps people understand your document type.**
	- 문서 타입의 이해를 도울 수 있다면 간결한 용어를 지정하세요. 
