---
layout  : wiki
title   : TCA를 통한 Firebase 연동
summary : firebase with TCA
date    : 2023-03-27 21:29:18 +0900
updated : 2023-03-27 21:30:07 +0900
tags    : firebase, tca
toc     : true
public  : true
parent  : [[tca]]
latex   : false
---
* TOC
{:toc}

# 서론
- 현재 진행 중인 프로젝트 `Tinowledge`를 TCA로 구현하려고 하는데, Firebase 에 대한 참고자료가 존재하지 않는 상황
- 필요한 기능
	- FirebaseAPI 연동
		- FirebaseAPIClient 생성 및 Environment에 선언
		- 데이터 조회
		- 데이터 입력

# 본론
## FirebaseAPIClient 생성

- 최초 APIClient에는 필요한 action을 추상화하여 선언한다.
	- fetchTins : `Tinowledge` 배열을 가져온다.
	- addTin : `Tinowledge`를 입력한다.
```swift
public struct FirebaseAPIClient {
	public var fetchTins: () -> EffectTask<[Tinowledge]>
	public var addTin: (_ tin: Tinowledge) -> Effect<None, APIError>

	public init(
		fetchTins: @escaping () -> EffectTask<[Tinowledge]>,
		addTin: @escaping (_ tin: Tinowledge) -> Effect<None, APIError>) {
			self.fetchTins = fetchTins
			self.addTin = addTin
		}
}
```

- 실제 Firebase에 접근하기 위해 extension으로 구체적인 변수들을 선언한다.
```swift
public extension FirebaseAPIClient {
	static let db: Firestore = Firestore.firestore()
	static var tins: [Tinowledge] = []

	static let live = Self(
		fetchTins: {
		},
		addTin: { 
		}
	)
}
```

## 데이터 조회 Action

```swift
fetchTins: {
	db.collection("Tinowledges")
		.addSnapshotListener { snap, error in
				if let error = error {
					print("fetch error: \(error)")
					return
				}
				tins = snap?.documents.compactMap { doc in
					try? doc.data(as: Tinowledge.self)
				} ?? []
			tins.shuffle()
			tins = Array(tins.prefix(5))
		}
	return .init(value: tins)
	}
```

## 데이터 입력 Action

```swift
addTin: { tin in
	let _ = try! db.collection("Tinowledges")
		.document(tin.id)
		.setData(from: tin)
	return .none
}
```

## 최종 코드

```swift
import Combine
import ComposableArchitecture
import Foundation
import SwiftUI

import Firebase
import FirebaseFirestore
import FirebaseFirestoreSwift


public struct FirebaseAPIClient {
	public var fetchTins: () -> EffectTask<[Tinowledge]>
	public var addTin: (_ tin: Tinowledge) -> Effect<None, APIError>

	public init(
		fetchTins: @escaping () -> EffectTask<[Tinowledge]>,
		addTin: @escaping (_ tin: Tinowledge) -> Effect<None, APIError>) {
			self.fetchTins = fetchTins
			self.addTin = addTin
		}
}

public extension FirebaseAPIClient {
	static let db: Firestore = Firestore.firestore()
	static var tins: [Tinowledge] = []

	static let live = Self(
		fetchTins: {
            print("api fetching...")
            DispatchQueue.global(qos: .background).sync {
            db.collection("Tinowledges")
                .addSnapshotListener { snap, error in
                        if let error = error {
                            print("fetch error: \(error)")
                            return
                        }
                        tins = snap?.documents.compactMap { doc in
                            try? doc.data(as: Tinowledge.self)
                        } ?? []
                    tins.shuffle()
                    tins = Array(tins.prefix(5))
                }
                print("DispatchQueue1")
            }
            print("DispatchQueue2")
			return .init(value: tins)
		},
		addTin: { tin in
			let _ = try! db.collection("Tinowledges")
				.document(tin.id)
				.setData(from: tin)
			return .none
		}
	)
}
```

# 결론

- 동작은 하지만, 원하는 대로 로직이 진행되지 않는 상황
	- 최초 View가 onAppear됐을 때, 바로 데이터 조회 action이 실행되어 화면을 그리고 싶은데, 빈 배열 형태로 `success`가 return 되는 현상이 있다.
