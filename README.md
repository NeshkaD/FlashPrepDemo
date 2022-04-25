# FlashPrep


FlashPrep is a online flash card software that uses an adaptive feedback algorithm to increase a student's studying efficiency. 
Whenever a student gets a card incorrect, the card appears more frequently than cards the student gets correct.

![FlashPrep logo](img/flashprep_logo_trans.png)

## Technical Specifications:
FlashPrep's front end uses Angular 11 & Jasmine JavaScript Testing Framework. \
FlashPrep's back end uses ExpressJS, NodeJS, Jasmine JavaScript Testing Framework, & MySQL database.


## Instructions for running:
Please ensure that you have the following downloaded and configured on your machine: \
Node Package Manager (NPM)\
Angular CLI (version 11+) \
ExpressJS \
MySQL \
NodeJS


Prior to running FlashPrep locally, you will need to have MySQL database server downloaded, configured, set up, and running. See [mysql](https://www.mysql.com/) for instructions for your computer operating system. 

In flashprep-backend/config/dbConfig.js, change your password to the password you have for MySQL database.


To run, please note that the front end and back end run on separate ports and you will need to have MySQL Database server running. First run the back end server (see /flashprep-backend README.md for instructions). Next start the front end web application (see /flashprep-front README.md for instructions). You will need to run these commands from the root of each respective directories (so you will need to have two separate terminal sessions open).





## Contributers:
Jared Barber (Product Manager) \
Arunabh Bhattacharya (Developer) \
Neshka Dantinor (Developer) \
Gustavo Cruz-Medina (Scrum Master) 

## FlashPrep Web Application Pictures

![](img/adaptive_feedback_study_mode.png)
![](img/create_add_new_card_to_deck.png)
![](img/create_deck_upload_csv.png)
![](img/dashboard.png)
![](img/delete_deck_dialogue.png)
![](img/edit_deck_page.png)
![](img/edit_update_card.png)
![](img/home.png)
![](img/login.png)
![](img/regular_study_mode.png)
![](img/sign_up.png)
![](img/study_mode_option_with_dashboard.png)
![](img/study_mode_options_dialogue.png)

