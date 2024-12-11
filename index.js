import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import axios from "axios";

const app=express();
const port=3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let reviews=[];

const db=new pg.Client({
    user:process.env.USERNAME,
    host:process.env.HOST,
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
    port:process.env.PORT,
});

db.connect();

app.get("/",async (req,res)=>{
    try{
        const result= await db.query("SELECT * FROM reviews");
        const data=result.rows;
       
        data.forEach(review => {
            reviews.push(review);
            review.created_at=formatDate(review.created_at)
        });
    
        res.render("index.ejs",{
            reviews:reviews
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
         const isbnUrl=`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`;
         const isbnResponse=await axios.get(isbnUrl);
         if (isbnResponse.data.docs && isbnResponse.data.docs.length > 0){
         const isbn = isbnResponse.data.docs[0].isbn ? isbnResponse.data.docs[0].isbn[0] : null;
         const coverUrl = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : "/default-cover.jpg";
         db.query("INSERT INTO reviews(book_title,book_cover_url,review,rating,created_at) VALUES ($1,$2,$3,$4,$5)",[title,coverUrl,review,rating]);
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

app.get("/edit/:id",(req,res)=>{
    const today = new Date();
    const date=formatDate(today);
    const reviewId = parseInt(req.params.id);
    const review = reviews[reviewId];
    if(review){
        res.render("edit.ejs",{
            date:date,
            review:review,
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
    reviews.splice(thisId-1,1);
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