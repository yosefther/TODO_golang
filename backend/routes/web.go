package routes
import (
	"github.com/gorilla/mux"
	"github.com/yosefther/TODO_golang/backend/controllers"
)

func Init() *mux.Router{
	router := mux.NewRouter()
	router.HandleFunc("/" , controllers.Show)
	router.HandleFunc("/add" , controllers.Add).Method("POST")
	router.HandleFunc("/delete/{id}" , controllers.Delete)
	router.HandleFunc("/complete/{id}" , controllers.Complete)
}