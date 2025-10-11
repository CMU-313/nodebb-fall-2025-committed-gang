// Comprehensive Outline of New Features 

// Feature 1: Polls Feature 

**Prerequisite**: composer-polls plugin to be activated, user must be logged in in order to create a post 
**New Topic**: Polls Icon (to the right of add thumbnail, to the left of add emoji)
Once selected, can configure poll with various handlers: 
- Poll Type: Single Answer, Multiple Choice, Ranked
- Options [Can add or delete, defaulted to two options to begin with. A poll can have up to 10 options]
- Vote Visibility: Anonymous, Voter names
- Closing time:  Specify closing date (future), No closing date 
- When configuring poll, if poll type or options are not selected, poll will error but not close out, allowing users to continue to edit their poll configuration without restarting
**Final actions**: Remove poll (deletes poll), Cancel (loses progress and cancels poll creation), Save poll (saves poll to the post draft, does not submit the poll until post is submitted)

**Post created (pressed submit)**: Once a poll is submitted the following functionalities are available on all polls: 
- Admin: Can close poll, edit poll, delete poll, change owner
- Voters: Can update vote, upvote, 
- Need to wait 5 seconds to be able to update vote again

**Specific functionality based on kind of poll**
- Single Answer: Select new answer, update vote
- Multiple Choice: Select new answer (multiple), update vote
- Ranked: Upvote, downvote – ranking will update accordingly, displaying a rank next to it for # of votes (most to least preferred)

**Testing**: 
- tests/plugins/composer-polls.js ⇒ added to automated test suite. Covers functionality of polls including: poll toolbar button added once, payload data sanitized and stored to poll, uid exception thrown when not numeric, persisting poll data within topic and references, attaching poll to posts 
- poll.test.js file ⇒ tests data saving to console.log (within plugin folder, within tests folder). Tests data saved to payload after the submission of the poll
- Tests sufficient as they test primary functionality points of the poll and where they may break within each of the categories described above. Utilizes unit tests to test core functionality of the poll (providing sample input for visibility, closesAt, createdAt, etc.)

// Feature 2: Censorship 

**Prerequestite**: nodebb-plugin-censor to be activated, user must be logged in as an admin in order to apply censorship constraints
**New Topic**: User creates a new post/new topic, any bad/harmful words are automatically censored.
**Admin Control**: Can control a .csv file with a list of “bad words” that should be censored. - Use cases include teachers in a forum, professional working environments, etc. Prevents posts from being offensive/potentially triggering

**Pre Submission**: While creating a topic, the average user can type anything they would like included in the post

**Post Submission**: If the words in the post are included in the .csv file that includes the bad words, the interface will censor them out with the asterisks symbols ****. 

**Testing**
- tests/plugins/censorship.js ⇒ added to automated test suite. Covers functionality of censorship including: bad words in posts automatically censored, bad words in code blocks or inline code not censored, 
- Tests sufficient as they test primary functionality points of the censorship feature and where they may break within each of the categories described above. Unit tests test edge cases that users should input using special characters. 

