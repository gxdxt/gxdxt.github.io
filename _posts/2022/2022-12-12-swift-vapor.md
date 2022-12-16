---
layout  : post
title   : Swift and Vapor 
summary : Server by Swift 
date    : 2022-12-12 18:00:40 +0900
tag     : study swift server vapor 
resource: 38/90F574-7578-4942-B299-A6D54199006F
toc     : true
comment : true
public  : true
---
* TOC
{:toc}


# Swift and Server

- Vapor 를 활용하여 HTTP 통신하는 Swift
- Swift의 언어적 특성에 따른 통신 방법의 차이를 보여주었으면 좋겠다.
- Firebase와 연동하는 것과 어떤 차이 그리고 어떠한 장점/단점이 있는지 이야기하면 좋겠다.
- 같은 조원 분들이랑 고민하여 추가적인 학습을 실시했다.


# 서론

다른 모든 언어가 그러하듯, Swift로도 Server를 만들 수 있습니다.
JS는 node.js, Python은 django로 만들 수 있습니다.
Swift를 위한 Framework는 다음과 같습니다.
iOS의 Server Framework
- Vapor
- Perfect
- Kitura


이 때, 아직 SwiftUI + Vapor 조합으로 잘 정리된 글이 없어 작성하게 되었습니다.

다음과 같은 순서로 글을 작성할 예정입니다.
다만  HTTP 관련 언급은 자제할 것입니다.

- 사전 작업 (Setting)
- HTTP Method
	- GET
	- POST
- Vapor의 용례
- Vapor의 한계


# 본론

## Setting

### 설치

[설치 방법 공식 문서](https://docs.vapor.codes/install/macos/)
주의해야할 점은 `version 호환성` 입니다.

> Vapor 4 requires Swift 5.2 or greater.
> - Vapor 4는 5.2 이상의 Swift 버전이 필요합니다.


### 프로젝트 생성

- Vapor를 사용하기 위해선 일반적인 Xcode 프로젝트 생성 방법을 따라가서는 안됩니다.
- [공식문서](https://docs.vapor.codes/getting-started/hello-world/) 에서 제시하는 순서에 따라 프로젝트를 생성해야 합니다. 

- `vapor new hello -n`
	- 'hello'라는 프로젝트를 생성하는 데, 생성  중 필요한 옵션들의 생성을 하지 않는다는 명령어

위 명령어를 통해 파일들이 생성되고, 아래 명령어를 통해 `hello` 라는 폴더로 들어갑니다.
- `cd hello`

그 후, `hello`폴더 하위에 있는 `Package.swift` 라는 파일을 엽니다.
- `open Package.swift`

> 생성된 파일들의 의미와 역할들은 추후 다른 글에서 설명하도록 하겠습니다.
> [reference](https://docs.vapor.codes/getting-started/folder-structure/)


- 딱 필요한 요소들만 작성한다면, 이제 `routes.swift` 파일에서 server들에 routing을 해준다고 생각하면 됩니다. (실제로도 그렇습니다.)

## GET

- 우리가  '`http://(domain)/` 이라는 곳으로 접속했을 때 보여줄 화면을 만들고 싶다' 라고 생각한다면 다음과 같은 코드를 작성해야 합니다.
```swift
app.get { req qsync in // get 뒤에 어떠한 인자도 넣지 않은 것
	"It works!"
}
```

- 위와 같은 페이지는 보통 `홈 화면` 이라고 생각하시면 됩니다!

- 다음으로 특정 `쿼리`가 들어가는 경로들입니다.
- `http://(domain)/search` 이라는 검색 페이지에 접속한다고 생각하면 다음과 같은 코드를 작성해야 합니다.
```swift
app.get("search") { req async in
	"이제 get뒤에 parameter가 전달이 되네요!"
}
```

- 저희는 이제 단순 `Text` 를 뿌리지 않고 `Data`를 불러오고 싶습니다!
```swift
app.get("sool", ":page") { req aynsc throws -> SoolRawJson in
	// 글자 앞에 ':'이 들어간 것은 '변수'라고 생각하시면 됩니다.
	// http://(domain)/page/12
	// http://(domain)/page/3
	// 이렇게 특정 숫자가 들어오게 됩니다.
	let webService: WebService: WebService()
	
	// 해당 위치의 변수는 아래 코드에 의해 현재 코드 블럭에서 사용할 수 있는 '진짜 변수'가 됩니다.
	let page = req.parameters.get("page")!
	
	// 이를 통해 url을 쏘게되고,
	let url: String = "https://www.naver.com?page=\(page)"
	// webService를 통해 데이터를 가져옵니다.
	let sools: SoolRawJson = try await webService.fetchSoolData(url: url)
	
	return sools
}
```

- 전체 코드
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

- `POST`는 `GET`과 달리, `req.parameters` 에 데이터들이 담기지 않습니다.
- 즉, url에 저희가 보내는 데이터가 노출되지 않는 것입니다.
- `POST`로 보내는 데이터는 `req.content`에 담깁니다.

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


# 참조

> iOS 개발자는 주로 클라이언트 사이드를 개발하기 때문에 서버 사이드 개발 경험이 많지 않습니다. 과제를 만들려면 결국 OpenAPI나 Json mock에 의지 해야 하고 과제 아이디어와 평가 요소에 제한이 생길 수밖에 없는 게 현실입니다.
> *[reference](https://tech.kakaopay.com/post/ios-assignment-vapor/)*

> Swift on Server
> - Small footprint
> - Quick startup time
> - Deterministic performance
> *[reference](https://www.swift.org/server/)*

> Comparing Server - Side Framework by Swift
> *[reference](https://academy.realm.io/kr/posts/swift-server-side-framework/)*
 
