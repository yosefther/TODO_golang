package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/yosefther/TODO_golang/backend/database"
	"github.com/yosefther/TODO_golang/backend/models"
)

var dp = database.Database()

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
}

func Show(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	rows, err := dp.Query(`SELECT * FROM todo`)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	var todos []models.Todo
	for rows.Next() { //the Next function move the cursor to the next row
		var t models.Todo
		rows.Scan(&t.Id, &t.Item, &t.Completed)
		todos = append(todos, t) // append the t to the Todo models
	}

	json.NewEncoder(w).Encode(todos)
}

func Add(w http.ResponseWriter, r *http.Request) {

	enableCORS(w)
	var t models.Todo
	json.NewDecoder(r.Body).Decode(&t)
	_, err := dp.Exec(`INSERT INTO todo (item) VALUES (?)`, t.Item)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "created"})

}

func Delete(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	id := mux.Vars(r)["id"]
	result, err := dp.Exec(`DELETE FROM todo WHERE id = ?`, id)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	if rowsAffected == 0 {
		http.Error(w, "Todo not found", 404)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "deleted"})
}
func Complete(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	id := mux.Vars(r)["id"]
	_, err := dp.Exec(`UPDATE todo SET completed = 1 WHERE id = ?`, id)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "completed"})
}
