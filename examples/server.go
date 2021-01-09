package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	addr1 := "localhost:8080"
	fileSvr1 := &http.Server{
		Addr:    addr1,
		Handler: http.FileServer(http.Dir("./bind_dst")),
	}
	log.Printf("[BIND_DST FileServer] Running On: %v", addr1)
	go func() {
		log.Printf("[BIND_DST FileServer] Stop: %v", fileSvr1.ListenAndServe())
	}()

	addr2 := "localhost:8081"
	fileSvr2 := &http.Server{
		Addr:    addr2,
		Handler: http.FileServer(http.Dir("./bind_src_dst")),
	}
	log.Printf("[BIND_SRC_DST FileServer] Running On: %v", addr2)
	go func() {
		log.Printf("[BIND_SRC_DST FileServer] Stop: %v", fileSvr2.ListenAndServe())
	}()

	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fileSvr1.Shutdown(context.Background())
	fileSvr2.Shutdown(context.Background())
	time.Sleep(time.Second / 10)
}
