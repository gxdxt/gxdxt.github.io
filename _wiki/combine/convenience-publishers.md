---
layout  : wiki
title   : 다양한 종류의 Publishers
summary : 유용한 Publishers를 알아보자!
date    : 2023-01-31 00:35:23 +0900
updated : 2023-01-31 00:36:03 +0900
tags    : 
toc     : true
public  : true
parent  : [[/combine]]
latex   : false
---
* TOC
{:toc}


# Combine Convenience Publishers

## Future

```swift
final class Future<Output, Failure> where Failure : Error
```

- A publisher that eventually produces a single value and then finishes or fails.

## Just

```swift
struct Just<Output>
```

- A publisher that emits an output to each subscriber just once, and then finishes.

## Deferred

```swift
struct Deferred<DeferredPublisher> where DeferredPublisher : Publisher
```

- A publisher that awaits subscription before running the supplied closure to create a publisher for the new subscriber.

## Empty

```swift
struct Empty<Output, Failure> where Failure : Error
```

- A publisher that never publishes any values, and optionally finishes immediately.

## Fail

```swift
struct Fail<Output, Failure> where Failure : Error
```

- A publisher that immediately terminates with the specified error.

## Record

```swift
struct Record<Output, Failure> where Failure : Error
```

- A publisher that allows for recording a series of inputs and a completion, for later playback to each subscriber.



# References

- [Swift Documentation](https://developer.apple.com/documentation/combine)

