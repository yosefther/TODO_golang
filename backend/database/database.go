package database

import (
	"database/sql"
	"log"
	"fmt"
	_ "modernc.org/sqlite"
)

func Database() *sql.DB{
	database , err := sql.Open("sqlite" , "./gotodo.db")

	if err != nil {
		log.Fatal(err)
	}

	_ , err = database.Exec(`
		CREATE TABLE IF NOT EXISTS todo(
		id		INTEGER PRIMARY KEY AUTOINCREMENT,
		item 	TEXT NOT NULL,
		completed BOOLEAN DEFAULT FALSE  		
		);
		`)
	
	if err !=nil{
		log.Fatal(err)
	}
	
	fmt.Println("The database connections is Successful!! yay <3")
	return database 
}
