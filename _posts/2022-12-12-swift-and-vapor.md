- Vapor 를 활용하여 HTTP 통신하는 Swift
- Swift의 언어적 특성에 따른 통신 방법의 차이를 보여주었으면 좋겠다.
- Firebase와 연동하는 것과 어떤 차이 그리고 어떠한 장점/단점이 있는지 이야기하면 좋겠다.
- 같은 조원 분들이랑 고민하여 추가적인 학습을 실시했다.

> iOS 개발자는 주로 클라이언트 사이드를 개발하기 때문에 서버 사이드 개발 경험이 많지 않습니다. 과제를 만들려면 결국 OpenAPI나 Json mock에 의지 해야 하고 과제 아이디어와 평가 요소에 제한이 생길 수밖에 없는 게 현실입니다.
> *[reference](https://tech.kakaopay.com/post/ios-assignment-vapor/)*

> Swift on Server
> 
> *[reference](https://www.swift.org/server/)*

> Comparing Server - Side Framework by Swift
> *[reference](https://academy.realm.io/kr/posts/swift-server-side-framework/)*

# 서론
- Vapor를 통한 통신 설정 개요

*** 서론 시작 ***
다른 모든 애플리케이션이 그러하듯, iOS App 역시 '통신'이 필요합니다.
iOS의 통신 방법에는 어떤 것들이 있을까요?
- Vapor
- ...
- ...

이번 개인 프로젝트를 진행하며, API에서 데이터를 불러오고, 데이터를 넣어주는 방법을 하던 중
~~ 한 이유로 Vapor 를 선택하여 프로젝트를 진행했습니다.
이 때, 아직 SwiftUI + Vapor 조합으로 잘 정리된 글이 없어 작성하게 되었습니다.

다음과 같은 순서로 글을 작성할 예정입니다
- 사전 작업 (Setting)
- HTTP Method
	- GET
	- POST
- Vapor의 용례
- Vapor의 한계

*** 서론 끝 ***

# 본론
- 구체적인 예시들과 코드 분석

## GET

```swift
import Vapor

func routes(_ app: Application) throws {
	app.get { req qsync in
		"It works!"
	}
	
	app.get("sool", ":page") { req aynsc throws -> SoolRawJson in
		let webService: WebService: WebService()
		let page = req.parameters.get("page")!
		
		let url: String = "https://www.naver.com?page=\(page)"
		let sools: SoolRawJson = try await webService.fetchSoolData(url: url)
		
		return sools
	}
}
```

### 필요 데이터

#### WebService
- JSON 파일을 받아오기 위한 fetch 함수 선언
```swift
class WebService {
	func fetchSoolData(url: String) async throws -> SoolRawJson {
		guard let url = URL(string: url) else { return SoolRawJson(currentCount: 0, data: [], matchCount: 0, page: 0, perPage: 0, totalCount: 0) }
		
		let (data, _) = try await URLSession.shared.data(from: url)
		let sools = try JSONDecoder().decode(SoolRawJson.self, from: data)
		return sools
	}
}
```

#### Models

```swift
import Foundation
import Vapor

struct Sool: Codable, Identifiable, Content {
	enum CodingKeys: String, CodingKey {
		case soolName = ""
		case sooleDegree = ""
		case soolSize = ""
		case soolSources = ""
		case soolMaker = ""
	}
	let id: UUID = UUID()
	...
}

struct SoolRawJson: Codable, Content {
	...
	let data: [Sool]
	...
}
```


## POST

```swift
import Vapor

func routes(_ app: Application) throws {
	(...)
	app.post("login") { req async throws -> Bool in
		let header: LoginSet = try req.content.decode(LoginSet.self)
		if ((header.id != "tae") || (header.pwd != "123")) {
			return false
		}
		return true
	}
}
```

### 필요 데이터

#### Content에 담을 JSON 형태의 구조체
- 로그인 시 넘길 데이터를 Content에 id와 pwd를 담아서 POST 방식으로 통신하려고 한다면, 다음과 같이 구조체를 선언해야 합니다.

```swift
import Foundation

struct LoginSet: Codable {
	let id: String
	let pwd: String
}
```

# 결론
- 
