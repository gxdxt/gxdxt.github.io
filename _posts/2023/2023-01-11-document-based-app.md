---
layout  : wiki
title   : Document Based App
summary : Document Based App
date    : 2023-01-11 22:42:02 +0900
updated : 2023-01-14 22:16:49 +0900
tags    : DocumentBasedApp
toc     : true
public  : true
parent  :
latex   : false
---
* TOC
{:toc}

# Document Based App

```swift

import SwiftUI
/// 1. 여러 형태의 타입들을 가지고 있다. (movies, audio, pictures, text files ...)
import UniformTypeIdentifiers

/// 2. 앞으로 다뤄야할 데이터 타입을 생성하자
/// FileDocument Protocol은 필수이다.
/// capable of loading and saving files
struct TextFile: FileDocument {
    
    /// essential methods 1
	/// FileDocument Protocol을 위한 init
    /// filerWrapper는 file이 우리 device 어딘가에 저장이 될텐데,
    /// 우린 알바 아니다.
    /// 그걸 꺼내서 우리가 읽을 수 있도록 하는 메소드
 
    init(configuration: ReadConfiguration) throws {
        if let data = configuration.file.regularFileContents {
            text = String(decoding: data, as: UTF8.self)
        }
    }
	
    /// essential methods 2
    /// 읽었으면 저장할 줄도 알아야지?
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        // text를 저장할 수 있게 먼저 Data 타입으로 변환
        let data = Data(text.utf8)
		
        // fileWrapper로 감싸야지
        return FileWrapper(regularFileWithContents: data)
    }
    
    /// 이제 어떤 종류의 파일들을 다루고 싶은지 이야기 해보자.
    /// 여기선 단순한 텍스트 파일을 다루게될 것이다.
    static var readableContentTypes = [UTType.plainText]
    
    /// 이젠 실제 text 파일을 만들어보자.
    /// default로 빈 String 값을 넣는다.
    var text = ""
    
    /// 초기화
    init(initialText: String = "") {
        text = initialText
    }
   
   }
}


struct ContentView: View {
    /// build our editing interface
    @Binding var document: TextFile
    
    var body: some View {
        TextEditor(text: $document.text)
    }
}
```

`UniformTypeIdentifiers`를 import 해서, Document화를 원하는 데이터 타입을 불러와야 합니다.
제가 이번에 Document화를 진행할 타입은 `txt` 타입의 데이터이기 때문에 `TextFile`이라는 구조체를 선언합니다.
그리고, 해당 파일을 읽고, 저장할 수 있도록 `FileDocument` 프로토콜을 따르도록 합니다.
해당 프로토콜은 의무적으로 선언해야 하는 메소드가 2개 있습니다.

- `init(configuration: ReadConfiguration) throws` 
- `fileWrapper(configuration: WriteCOnfiguration) throws -> FileWrapper`

이 두 메소드가 `FileDocument` 프로토콜에서 제시하는 메소드 인데요.
각 메소드의 인자값의 데이터 타입을 통해 눈치챌 수 있듯, init은 읽기, fileWrapper는 쓰기 를 위한 메소드 입니다.





```swift
import SwiftUI

@main
struct DocumentBasedAppPracticeApp: App {
    var body: some Scene {
        /// default인 WindowGroup에서 DocumentGroup으로 변경해주어야 한다.
        DocumentGroup(newDocument: TextFile()) { file in
            ContentView(document: file.$document)
        }
    }
}
```

WindowGroup이 아닌, DocumentGroup으로 ContentView를 감싸니, 전형적인 Document Based App의 화면처럼 보이게 되었습니다.
자동으로 설정 툴바와 `add item` 툴바가 생성되었습니다.

***

오류

- 최근 항목, 즉 root에서 생성은 안되고
- Executable File이 의심스럽다.
- info.plist > Supports Document Browser 추가 후, YES
- [ref](https://www.appcoda.com/files-app-integration/)

