---
layout  : wiki
title   : Document Based App
summary : Document Based App
date    : 2023-01-11 22:42:02 +0900
updated : 2023-01-13 00:25:41 +0900
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
    init(configuration: ReadConfiguration) throws {
        if let data = configuration.file.regularFileContents {
            text = String(decoding: data, as: UTF8.self)
        }
    }
    /// essential methods 2
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        let data = Data(text.utf8)
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
    
    /// FileDocument Protocol을 위한 init
    /// filerWrapper는 file이 우리 device 어딘가에 저장이 될텐데,
    /// 우린 알바 아니다.
    /// 그걸 꺼내서 우리가 읽을 수 있도록 하는 메소드
    init(fileWrapper: FileWrapper, contentType: UTType) throws {
        /// read the file content
        if let data = fileWrapper.regularFileContents {
            text = String(decoding: data, as: UTF8.self)
        }
    }
    
    /// 읽었으면 저장할 줄도 알아야지?
    func write(to fileWrapper: inout FileWrapper, contentType: UTType) throws {
        // text를 저장할 수 있게 먼저 Data 타입으로 변환
        let data = Data(text.utf8)
        // fileWrapper로 감싸야지
        fileWrapper = FileWrapper(regularFileWithContents: data)
        
        // inout FileWrapper이기 때문에, 무언가 자동화가 되서 신경 안써도 되는게 있나봐
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


오류

- 최근 항목, 즉 root에서 생성은 안되고
- Executable File이 의심스럽다.
- info.plist > Supports Document Browser 추가 후, YES
- [ref](https://www.appcoda.com/files-app-integration/)

