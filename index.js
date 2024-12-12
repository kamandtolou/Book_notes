import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import axios from "axios";
import env from "dotenv";

const app=express();
const port=3000;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db=new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

db.connect();

app.get("/",async (req,res)=>{
    try{
        const result= await db.query("SELECT * FROM reviews");
        const data=result.rows;
    
        res.render("index.ejs",{
            reviews:data
        });
    }
    catch(err){
        console.error("Error fetching reviews:", err);
        res.status(500).send("Error fetching reviews");
    }
});

app.post("/add",async (req,res)=>{
    try{
         const title=req.body.title;
         const rating=req.body.rating;
         const review=req.body.review;
         const today = new Date();
         const date=formatDate(today);
         const isbnUrl=`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
         const isbnResponse=await axios.get(isbnUrl);
         if (isbnResponse.data.docs && isbnResponse.data.docs.length > 0){
         const isbn = isbnResponse.data.docs[0].isbn ? isbnResponse.data.docs[0].isbn[0] : null;
         const coverUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : "/default-cover.jpg";
         db.query("INSERT INTO reviews(book_title,book_cover_url,review,rating,created_at) VALUES ($1,$2,$3,$4,$5)",[title,coverUrl,review,rating,date]);
         res.redirect("/");
         } else{
            console.log("no books found for the given title!");
            res.status(404).send("No books found for the given title. Please try again.");
         }
    }
    catch(err){
        console.log("error:",err.message);
        res.status(500).send("An error accured please try again!");
    }
});

app.get("/create", (req, res) => {
    const today = new Date();
    const date=formatDate(today);
    res.render("new.ejs",{
        date:date
    });
   
});

app.get("/edit/:id",async (req,res)=>{
    const today = new Date();
    const date=formatDate(today);
    const reviewId = parseInt(req.params.id);
    const theReview=await db.query("SELECT * FROM reviews WHERE id=$1",[reviewId]);
    const result = theReview.rows[0];
    if(result){
        res.render("edit.ejs",{
            created_at:result.created_at,
            review:result.review,
            rating:result.rating,
            title:result.book_title,
            reviewId : reviewId,

        });
    }
    else{
        res.status(404).send('Review not found');
    }
    
});

app.post("/update/:id",async (req,res)=>{
    try {
        const newReview=req.body.updatedReview;
        const newId=req.params.id;
        await db.query("UPDATE reviews SET review=($1) WHERE id=$2",[newReview,newId]);
        res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.post("/delete/:id",async(req,res)=>{
    try{
    const thisId=req.params.id;
    await db.query("DELETE FROM reviews WHERE id=($1)",[thisId]);
    res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});

app.listen(port,()=>{
    console.log(`the server is running on port ${port}`);
})


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}