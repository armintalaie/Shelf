<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->



<br />
<p align="center">


  <h1 align="center">Shelf</h1>

  <p align="center">
    A user-based website to upload products and manage
product/inventory
    <br />
    
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#project-explanation">Project Explantion</a>
    </li>
    <li>
      <a href="#website-navigation">Website Navigation</a>
      <ul>
        <li><a href="#website-link">Website Link</a></li>
      </ul>
    </li>
    <li><a href="#user-information">User Information</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<br>

<hr>

## Project Explantion

For this website, I wanted to learn Node so I thought it would be the perfect opportunity to learn it while I implement this project.

I node and express to create this web app, bootstrap for the frontend, passport.js for user authentication, mongoDB and mongoose for my database and models

It is an image/product repository with the following features: 
<ul>  
 <li> Image repository</li>
 <ul>
  <li> upload products</li>
   <li> delete products</li>
    <li> edit/modify products</li>
     <li> public status</li>
     <li> see products from other users + themselves in their home feed </li>
 </ul>
 </ul>
 <br>

 <p> Users can upload products with images, name, quantity and price to their inventory. These images are stored in a mongodb database.
<br>Users can see all ther products in their inventory while, only their public products are shown in the home feed to others
</p>

<ul>  
 <li> User Database and Session</li>
 <ul>
  <li> Sign up/Sign in</li>
   <li> Only user has access to delete or modify their own products</li>
    <li> passwords are hashed</li>
 </ul>
 </ul>

<br>
<p> I implemented a database via mongodb and mongoose to store user information. Additonally, users are authenticated using Passport.js and their passwords are hashed before stored in the database <br> this also provides users with access to modify only their own products
</p>

<ul>
<li class="h4"> Search Feature </li>
</ul>
Users or non-users can search for a product name using the search bar
<br><br>

<hr>


## Wesbite Navigation

### [Wesbite Link](https://guarded-coast-71095.herokuapp.com/)


<ul>  
 <li> User Management</li>
 <ul>
  <li> the "sign up" and "sign in" button in the navigation bar will allow you to create an account or login</li>
   <li> password must be at least 6 characters long</li>
    <li> wrong info when signing in, refreshes the sign in page</li>
 </ul>
 </ul>

 <br>

 <ul>  
 <li> Product management</li>
 <ul>
  <li> To be able to add a product, first sign in or sign up then sign in. Then you can click the button on the top right to add a product.<br> after creating the product, it will navigate to your inventory page containing
                                        the new product</li>
   <li> To allow product to be visible in the home feed for everyone, select the public checkbox</li>
    <li> To see details of a product, hover over the product and you'll see "more" bottom left of the image. Click on it to see product information. Also, to be able to delete, or edit it, user must own the product</li>
 </ul>
 </ul>

 <br>

 <ul>  
 <li> Home tab</li>
 <ul>
  <li> the home tab shows the feed with public photos</li>
 </ul>
 </ul>

 <br>

  <ul>  
 <li> Inventory</li>
 <ul>
  <li> to see your inventort, after signing in, click on hte {user's name}'s shelf', on the right of the navigation bar</li>
 </ul>
 </ul>

<hr>

## User Information

<p>I've created a couple of sample users to fill up the website. You can either sign in as one of them or create another account
</p>


|    | Username             | Password    |
| -- |:--------------------:| -----------:|
| 1  | shopify@shopify.com  | shopify2021 |
| 2  | user1@gmail.com      | user1user1  |
| 3  | user2@gmail.com      | user2user2  |
| 4  | user3@gmail.com      | user3user3  |


<br><br>

<hr>

<!-- CONTACT -->
## Contact

Armin Talaie 
<br>
[Email](talaiearmin78@gmail.com) - talaiearmin78@gmail.com
<br>
[LinkedIn](https://www.linkedin.com/in/armin-talaie) 
<br>
[Resume](https://www.dropbox.com/s/ximsur9h8ah2uvd/Armin_Talaie_Resume.pdf?dl=0) 
<br>
<hr>


