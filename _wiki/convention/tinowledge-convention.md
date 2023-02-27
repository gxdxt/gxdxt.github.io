---
layout  : wiki
title   : Tinowledge Convention
summary : 
date    : 2023-02-27 20:17:20 +0900
updated : 2023-02-27 20:18:06 +0900
tags    : 
toc     : true
public  : true
parent  : [[/convention]]
latex   : false
---
* TOC
{:toc}


# Code Convention

## SwiftLint

- SwiftLint homebrew로 설치
- [StyleShare SwiftLint](https://github.com/StyleShare/swift-style-guide#%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%EA%B6%8C%EC%9E%A5%EC%82%AC%ED%95%AD)

***

## Issue Template
- [reference](https://github.com/woowacourse-teams/2022-dallog)


### Bug Template

```markdown
## 버그 내용

## 버그 재현 방법
1.
2.
3.

## 스크린샷

## 참고 사항

```


### Feature Template

```markdown
## 구현할 기능

## 상세 작업 내용

- [ ] To-do 1
- [ ] To-do 2
- [ ] To-do 3

## 참고 사항

## 예상 소요 기간

```

***

## Commit Template

[reference 1](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)
[reference 2](https://www.conventionalcommits.org/en/v1.0.0/)

- Angular Commit Convention 을 따르는 Template을 사용합니다.
- 해당 포멧은 .gitmessage 파일로 공유될 예정입니다.

```shell
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Revert

- 이전 버전으로 커밋을 롤백하는 경우, commit msg는 `revert:` 로 시작해야 합니다.
- body 부분에 롤백하는 commit의 번호를 `This reverts commit <hash>.` 형태로 작성해줍니다.

### Type

- 아래 타입들 중 하나를 무조건 선택해야 합니다.
- `build:` : 빌드 시스템 및 외부 의존성에 영향을 주는 변경됐을 경우
- `ci:` CI 설정 파일 및 스크립트가 변경됐을 경우
- `docs:` 문서 작업에만 변경이 있는 경우
- `feat:` 새로운 기능이 추가됐을 경우
- `fix:` 버그가 수정됐을 경우
- `perf:` 성능 개선에 대한 코드를 작성했을 경우
- `refactor:` 버그를 고치거나 새로운 기능 같은 것이 아닌 코드 변경의 경우
- `style:` 코드에 의미있는 변경이 아닌 경우 (공백, 포멧, 세미콜론 추가 등)
- `test:` 놓친 테스트가 추가되거나 현재의 테스트를 수정할 경우


### Subject

- 주체는 변경점에 대한 '간결한' 설명을 포함해야 합니다.

- 항상 명령형과 현재형을 사용합니다.
- 첫 번째 글자를 대문자로 사용하지 않습니다.
- 끝에 온점을 찍지 않습니다.

### Body

- Body 부분에는 이전 작업들과 비교와 변경의 계기들을 포함해야 합니다.

### Footer

- Footer 부분은 **Breaking Changes**와 **이슈 넘버와 함께** 이번 커밋이 **종료**되었다는 것을 알려야 합니다.

예시)

```
	BREAKING CHANGE: isolate scope bindings definition has changed and
    the inject option for the directive controller injection was removed.
    
    To migrate the code follow the example below:
    
    Before:
    
    scope: {
      myAttr: 'attribute',
      myBind: 'bind',
      myExpression: 'expression',
      myEval: 'evaluate',
      myAccessor: 'accessor'
    }
    
    After:
    
    scope: {
      myAttr: '@',
      myBind: '@',
      myExpression: '&',
      // myEval - usually not useful, but in cases where the expression is assignable, you can use '='
      myAccessor: '=' // in directive's template change myAccessor() to myAccessor
    }
    
    The removed `inject` wasn't generaly useful for directives so there should be no code using it.

```

```
	Closes #234
	or in case of multiple issues:
	Closes #123, #245, #992
```


***

## PR Template

[refence](https://github.com/woowacourse-teams/2022-dallog)

```markdown
- [ ] 🔀 PR 제목의 형식을 잘 작성했나요? e.g. `[feat] PR을 등록한다.`
- [ ] 💯 테스트는 잘 통과했나요?
- [ ] 🏗️ 빌드는 성공했나요?
- [ ] 🧹 불필요한 코드는 제거했나요?
- [ ] 💭 이슈는 등록했나요?
- [ ]  🏷️ 라벨은 등록했나요?
- [ ] 💻 git rebase를 사용했나요?

## 작업 내용
-

```

