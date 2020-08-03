#Exam in PG6301

Link: <link>http://localhost:8080

###Introduction
<p>First of all I want to say I was quite happy when i saw the assignment at first glance. It looked just as I had imagined when i did the mock-exam and prepared for this.</p>
<p>Then I started working on it, and well, my girlfriend told me a few hours ago that it looks like i have aged around 30 years. Yeah, this exam has taken it's toll.</p>
<p>This project is made based on the code in</p><link>https://github.com/arcuri82/web_development_and_api_design/</link>
<p>As you probably can see from my code a lot of the groundwork comes from this, and i have tried to the best of my ability to provide a link for the code i have used there in the project. I have also leaned a lot on the mock exam i produced during my preparations, but it is as heavily based on the code in the repository as this exam is.</p>
  
###Project Structure
<p>The project is made with React and Node.js, and i have also used babel, webpack, express and jest for testing.</p>
<p>When the sensor starts the application they will be taken to a mostly empty page. There they will get the options of checking out the wiki for all the game items, logging in, signing up, and they also get a message that they are not logged in.</p>
<p>If they sign up(as you have to do as a new player) they will be logged in as well, and they can see they have gotten 1 special anniversary card only available during this project(will have to manually remove it later). They can also see that they have gotten enough in-game credits to buy three lootboxes.</p>
<p>When they hit buy for the three lootboxes, the player gets three random cards. They can then choose to keep them, or sell them for cash. The vendor price is displayed in the table, and the anniversary card does not return any in-game currency.</p>
  
<p>But there are some missing components here. I did not have time to include a counter on the items, to display when the user had several similar items. Also, i noticed a little late that a it was a suggestion not to let other users see the inventory of others. As it was not strictly in any of the given criteria, I didn't think of it until now, a couple of hours before deadline.</p>
  
###Commands
Commands  | Description
------------- | -------------
yarn test  | Runs test coverage
yarn dev  | Starts client and server for development
yarn build | Building the project
yarn watch:client | Starts the client for development
yarn watch:server | Starts the server for development
yarn start | Regular start of the server with node

<p>Starting sequence should be like this: yarn install, yarn test, yarn dev.</p>

###Testing
<p>The testing fase was kind of infuriating, but the jest function made it interesting and almost as a game, trying to cover as much code as possible before the deadline.</p>

#####%Stmts of all files: 52.36.

![picture](test.png)

###Project Evaluation
<p>This has been frustrating, to say the least, but also incredibly giving. I have learned mor javascript in these two days than I could possible hope for. I thought I was well prepared, and in fact I was, but still you managed to surprise me.</p>
<p>I'm not lying when I say that after 6 hours of getting nowhere on the second day, I let out some tears. But as I kept on going I made a breakthrough, and I am so proud of how far I actually got with this exam.</p>
<p>I got as far as I got, and I am satisfied with the result I have for these 48 hours.</p>


###Accomplished componants
<p>I have done T1, T2, T3, T4(but not with duplicates showing), T5, but not T6.</p>
<p>I have done R1, R2, R3, but not R4 and R5</p>
<p>Test coverage of 52.36%.</p>