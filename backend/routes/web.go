package routes

import (
	"github.com/gorilla/mux"
	"github.com/yosefther/TODO_golang/backend/controllers"
)

func Init() *mux.Router {
	router := mux.NewRouter()
	router.HandleFunc("/", controllers.Show).Methods("GET")
	router.HandleFunc("/add", controllers.Add).Methods("POST")
	router.HandleFunc("/delete/{id}", controllers.Delete).Methods("DELETE")
	router.HandleFunc("/complete/{id}", controllers.Complete).Methods("PUT")
	return router
}