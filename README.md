yahoo-finance
=============

#### DEMO: ####
http://candpgeneration.com/yahoo-finance
#### Notes: ####
Each box displays the percent change for the current interval. Click on each of the boxes to view latest quote details.

#### Known issues: ####
1. It's not 'Real Time' because I do not have access to real time data. 
2. The Yahoo Finance API returns bad data for certain indeces, so those have been commented out - as a result only 5 indeces are displayed in this demo. If one of those 5 fails, you will only see 4.. etc.
3. Best viewed in modern browsers (IE10+)
4. No Unit tests. :boom:
5. Needs better error handling - especially since the API is unreliable. One possibility: an http interceptor for all yahoo requests, and a message to the user to retry.
6. 6. Initial load is slow as mollases - blame yahoo! ha!

#### Caveats: ####
I am not a financier, hence I do not know what aspects of the data are 'important'. The % change for each interval is just UI sugar. More pertinent info can just as easily be displayed there. Also, this is by no means a 'production' ready app. A lot more architecting would go into an actual application, ie.: individual angular modules, a better graphing library, or custom d3 graphs, SASS instead of plain CSS, build environment (node, npm..), unit tests.. etc...etc..

## Challenge Brief ##
https://www.gapjumpers.me/questions/mckinsey-digital-labs/qs-154/#resourcetab

You've been tasked to create a real time dashboard to display trading data from the top 10 global stock indexes.
Using any JS framework implement a prototype dashboard.
Make the necessary assumptions regarding the data sources and host your app publicly.

#### Deliverables: ####
Product Analysis, Prototype, Test Cases
Duration & Format: 3 Days  English  Code Base Web Application
