---
layout  : wiki
title   : Render Loop와 Hitch 
summary : WWDC 정리 
date    : 2023-03-06 10:57:41 +0900
updated : 2023-03-07 15:57:48 +0900
tags    : 
toc     : true
public  : true
parent  : [[root-index/animation]]
latex   : false
---
* TOC
{:toc}


# Hitch?
- Animation hitches can cause jumps in animation and break the connection.
- A hitch is any time a frame appears on screen later than expected.
- Hitches are caused when the Render Loop fails to finish a frame on time.

# The Render Loop
- The Render Loop is a continuous process by which touch events are handed to an app, and then changes to the UI are sent to the OS where the frame is finalized.
- It happens at the device's refresh rate.

## iPhone & iPad
- Refresh rate: 60Hz
- Frame duration: 16.67ms
> This is 60 frames per second.
> which means a new frame can be displayed every 16.67ms.

## iPad Pro
- Refresh rate: 120Hz
- Frame duration: 8.33ms

## The Render Loop

- Beginning
	- the hardware emits an event called a VSYNC.
> The VSYNC denotes when a new frame must be ready.

- The Render Loop is timed to VSYNCs.
- Three Stages
	- App
	- Render Server
		- This stage is where your UI is actually rendered.
	- On the display
- This 3 stages must complete before the next VSYNC.
- Double Buffering
	- App + Render Server stages
	- To avoid hitches, the system may switch to triple buffering.
		- render server stage is given one extra frame duration to complete its work.
- The Real Render Loop (5 phrases)
	- App
		- Event (Layer Tree)
			- your app handles touch events and decides if a change is needed in the UI.
		- Commit (Layer Tree)
			- your app updates the UI, and submits that to the render server for rendering.
	- Render Server
		- Render prepare (Image)
			- the Render Server takes the submission, and prepares it for drawing on the GPU.
		- Render execute
			- the GPU draws your UI into a final image.
	- On the display
		- Display
			- the frame can be displayed to the user.


![[https://user-images.githubusercontent.com/69609972/223346844-6ea27296-227f-4a3f-9c52-a61fc249f6d7.png]]

# Types of hitches

## Commit hitch
- App takes too long to commit or process an event.
- happen within the app's process.
![[https://user-images.githubusercontent.com/69609972/223346865-fc15fad8-ea3c-46ea-81a1-9819d7e81dca.png]]
- the render server has nothing to process and must wait for the next VSYNC to begin rendering
- 16.67 ms, we call this delay duration "hitch time".
![[https://user-images.githubusercontent.com/69609972/223346882-9b96c611-db78-4816-9dae-f91c01588e85.png]]

- [more info about commit hitches](https://developer.apple.com/videos/play/tech-talks/10856)

## Render hitch
- Rendering on the server does not complete in time.
- happend within the Render Server's process.
- These happen when the render server is unable to prepare or execute our layer tree on time.

![[https://user-images.githubusercontent.com/69609972/223346890-c647f6ad-ca1b-44d4-8da2-055d26bc318f.png]]

- [more info about render hitches](https://developer.apple.com/videos/play/tech-talks/10857)


# Measuring hitch time

## Difficulty
- it's difficult to compare unless each scroll or animation takes the exact same amout of time and therefore the exact same number of frames.
- iOS device does not always update their screen, if there are no commits sent to the Render Server.

## Hitch Time Ratio
- It is the total hitch time in an interval divided by its duration.
	- Because it's normalized to total time, we can compare it across experiences.
- [The Way of Using it](https://developer.apple.com/videos/play/wwdc2020/10081/)
- [To track hitch time ration in the test suite](https://developer.apple.com/videos/play/wwdc2020/10077/)

## Usage

- Duration
	- 30 frames at 60 FPS = 0.5 s
- Hitch time
	- 0 ms
- Hitch time ratio
	- 0/0.5 = 0 ms/s

![[https://user-images.githubusercontent.com/69609972/223346918-9b65af98-742d-4e1a-8f9a-805a0972c291.png]]

- Duration
	- 30 frames at 60 FPS = 0.5 s
- Hitch time
	- 100.02 ms
- Hitch time ratio
	- 100.02/0.5 = 200.04 ms/s

![[https://user-images.githubusercontent.com/69609972/223346924-ed0dc647-eade-4d58-a264-4b3870be8d84.png]]

## User Impact Targets

![[https://user-images.githubusercontent.com/69609972/223346928-855be67a-5e0f-4c18-812d-b5a08aebd515.png]]

# References

- [Explore UI animation hitches and the render loop](https://developer.apple.com/videos/play/tech-talks/10855/)
