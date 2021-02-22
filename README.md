## Project Title
Tutor Bounty

## Team Members
Raiyan Rahman, Bilal Ahmed, Yiming Zhong

## Description
An online platform where students/professionals can offer to teach students seeking to learn more about an area of interest, study for an exam, etc. ~~Kind of like Uber but for online learning.~~

Students would post a “request” for a specific course and topic on the posting board, and also assign a monetary value to it (could also be $0 i.e. seeking volunteers only). This would also be broadcasted and available for any other students/professional that are knowledgeable about the posting.

Upon accepting, a chatroom + video area would be allocated where the student and instructor can interact.

A rating system that cuts both ways will let students/instructors rate each other and provide feedback. The higher your rating, the more likely you are to be recommended.

## Profiles
Instructors can specify what they are knowledgeable in, what courses they’ve taken in the past, etc. Students, when creating a posting, will specify the course it pertains to, topics, etc.

## Key Features
* Users will be able to create accounts and list what their strengths are and what they would like to learn.
* Users can view and create postings (i.e a request for help on a topic)
    * This posting would include the course, topics in the course, date & time, duration, etc.
    * Postings may have a monetary value attached to them, or be volunteer only
* Users can request tutors to teach them specific subjects, corresponding to courses or even supplementary material, at a specific date and time.
    * When an agreement is reached, users will be able to communicate through the application either via chat messaging or video call
* Users that want to act as tutors can take up such requests and after the student matches with them, the tutor can then proceed to teach the student at the specified meeting time.
* Once the tutoring session is complete, both student and tutor can rate each other on a few different criteria to help future students and tutors at how good the experience was
    * The rankings of each student/tutor are calculated using this along with other variables

## Additional Features
* Add a chatting feature between the student and tutor so they may communicate in the app and negotiate the timing, the subject of learning, etc.
* Add a voice and video calling component so that students and tutors may communicate and work on the app itself for their meeting.
Set up recurring meetings, if desired.

## Technology Stack

### Database:
* MongoDB
* Redis

### Backend:
* Express server + typescript
* Oauth 2 for local/third-party sign up/sign in
* A cluster of server instances to occupy all available threads

### Front-end:
* VueJS (v2)
* WebRTC for video chat (Peer JS)


### Other
* Hosting via one of: Heroku, Digital Ocean, Google Cloud web hosting
* Build docker image for server before deployment
* Free domain name via NameCheap student discount + free SSL via certbot

## Description of Technical Challenges
1. How to organize and balance the different listings based on the number of interested instructors, monetary value, time since listing creation, etc.

2. Integrating voice and video calling in the application might prove difficult without good APIs that can be leveraged.

3. The UX component of the website should be designed well so that users are able to navigate and utilize all the available features with ease.

4. A notification system that would notify users of any changes or updates to their meeting plans. This would need to be consistent between student and tutor and would need to be responsive to both.

5. Payment processing, choosing a specific vendor, fees that might accumulate on top of each purchase, and scenarios where one party does not fulfill their end of the agreement (e.g. if tutor gets paid and decides not to teach, or if they teach well but payment doesn’t go through)