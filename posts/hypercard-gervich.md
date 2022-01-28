---
title: 'How I learned to Stop Worrying and Love HyperCard'
excerpt: "An essay dredged straight out of 1990, about HyperCard and obstinancy."
date: '2022-01-27'
author:
  name: Jason Gervich
---
I recently became interested in the field of human computer interfaces, and acquired a book of essays called *The Art of Human-Computer Interface Design*, as it wasn’t available anywhere online and was fairly cheap used. Originally published in 1990, it is a collection of essays, half from Apple employees, on topics related to interface design, from technical, philosophical, and methodological viewpoints. Edited by Brenda Laurel, the volume includes a range of impressive authors: Howard Rheingold, Don Norman, Joy Mountford, Alan Kay, Jean-Louis Gassée, Timothy Leary, Nicholas Negroponte, and even a young Douglas Crawford, as well as many other accomplished designers I’m leaving out. The following essay was written by Jason Gervich, who, as far as I can tell, was a technical writer, had little other internet presence, and died in 2010. I found it to be a humorous account of a very new way of doing things “clicking” with a user and an interesting perspective into why a piece of software from 1987 is still talked about so fondly.

Below is all from the published book.

USER CONTROL. Consistency. Modelessness. Forgiveness. Feedback.

It seemed hopeless. How would I ever adapt? Everyone was raving about HyperCard. And I hated it! After working as the writing manager for a year and a half on *The Human Interface Guidelines: The Apple Desktop Interface* , I knew what a good interface was. And HyperCard didn’t have it.

I couldn’t believe the buttons! When you clicked on them, nothing happened! No highlight, no cursor change, nothing. Not only that, but you only clicked on an icon once. Not twice, but once! I was highly skilled in the art of double-clicking. It drove me nuts either to end up somewhere that I wasn’t trying to get to or to be wasting all that good double-clicked energy. Talk about energy crises.

Then there were the scroll bars. There weren’t any. And the resizable windows. You couldn’t. But worse than that was the auto-save. Who said the user was in control? We did. And before HyperCard, we were right. But now, HyperCard was in control. It saves your work whether you want it to or not. Make a backup before you begin, or else!

Even more disastrous was the “Delete Card” menu item. Not only was there no verification prompt, you could not undo a deleted card. Once it was gone, it was gone!

Talk about modelessness. Take the script editor. As modal as they get. This baby’s so modal that you have to use the keyboard equivalents just to cut and paste.

Yes, it seemed that Armageddon was here. The mouse had roared. One cutesy little graphics program written by a guy in a basement! had toppled the interface we knew and loved. How did it happen?

Why did we work so hard to come up with an interface that was supposed to be consistent among all applications? Why did we practically threaten developers with exile in MS-DOS-land if they didn’t follow our interface religiously? Why was Sculley letting Atkinson single-handedly destroy all our hard-earned success in evangelizing the interface? Was HyperCard an IBM conspiracy? My paranoia seemed to know no limits. These were tough questions and I had to get the answers.

I read and reread the *Guidelines* to see if there was some way to interpret them to allow for such bastardization of the canon. There wasn’t. No consolation there.

What puzzled me even more was how self-respecting Apple employees who should know better could go around singing the praises of this heresy. They professed to adhere to Apple Values, yet they were out there committing treason.

I was still no closer to an answer. Then it hit me. An absolutely brilliant strategy was revealed to me as I stared at the Home card with its cute little buttons and nonexistent scroll bar. IGNORE IT and it will GO AWAY. I did. It didn’t.

I buried my head in the sand of my next projects, writing programming overviews for the Macintosh and IIGS. The purpose of these books was to explain and encourage the adoption of the Apple Desktop Interface as well as to provide developers with a technical overview as to how to go about writing the code. Upon the completion of these projects, I was given the *HyperCard Script Language Guide* as one of my new assignments. My head-in-the-sand strategy was suddenly rendered inoperative. I had to confront the beast head on.

Being a hands-on kind of guy, I prepared myself to start learning HyperCard and HyperTalk. At first I was just a browser, using HyperCard for my ToDo list and calendar. I still hated the buttons that didn’t highlight when I selected them, and I usually double-clicked them out of habit, occasionally finding myself in some unknown quadrant of hyperspace. Greatly intimidated by the auto-save and the non-reversible Delete menu item, I was a very conservative hyperspace navigator. When I expressed some of my hyperfears to the writer of the *Script Language Guide*, he suggested that I modify the buttons and the Delete menu item to make them function the way I wanted them to. Needless to say, I jumped at the chance to right the wrongs that had been inflicted upon me and (as I imagined) countless thousands of other HyperCard users.

Being thus liberated (a little knowledge being a truly dangerous thing), I went crazy checking the “Auto Hilight” option on every button that I could get my mouse on. I became a button crusader, | absolutely loved that black veil of darkness that would enshroud each button when I (single-)clicked on it. But now it was time to get serious. I was initiated into the mysteries of “DoMenu” and was shown how to write a script that brought up a “Delete this Card?” dialog box. After testing the script, I immediately pasted it into my home stack and heaved a great sigh of relief. Not only had I been able to rectify one of the worst sins of HyperCard, I had customized my environment and taken a giant step forward for Hyperkind. The user was in control again! I didn’t realize it yet, but now I was hooked.

Bolstered my previous conquests, I continued my assault on the HyperCard interface. I had always wanted to be able to print a range of cards starting with the present card, but nooooooo. HyperCard forced me to print either one card manually or the entire stack. But I wanted to print only the next two or three weeks of my calendar, not the entire year. So....

I began to write a script that would let me print a specified number of cards starting with the current card. After about a week, I had completed the script. It even told the user how many pages it was printing and when the task was completed. I showed my printing utility to the head of the department; she liked it so much that she had it incorporated into our department’s HyperCard phone book stack. I began to dream of other utilities that I could create, perhaps I could even....

My mouse had roared—I had learned to stop worrying and love HyperCard.

*Note: The fact that I was ultimately seduced by the empowerment that HyperCard can bring to a user should not be construed as endorsement or approval of what I see as the deficiencies of the HyperCard interface. Rather, this chapter’s focus is on the paradigm shift that took place when I attempted to make the transition between a known, familiar interface to one with significant variations and anomalies*

*Ed. Note: Bill Atkinson, the guy in question, was also instrumental in designing the very interface that the author is attached to. As Larry Tesler puts it, “When them that made the rules break the rules, people get upset.”*
