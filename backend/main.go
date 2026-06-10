package main

import (
    "fmt"
    "log"
    "net/http"
    "github.com/yosefther/TODO_golang/backend/routes"
)

func main() {
    router := routes.Init()
    fmt.Println("Server running on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", router))
}