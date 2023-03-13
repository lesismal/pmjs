package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"
)

type H struct {
	http.Handler
}

func (h *H) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if !strings.Contains(r.URL.Path, "redirect") {
		h.Handler.ServeHTTP(w, r)
		return
	}
	http.Redirect(w, r, "/#page_2", 302)
}

func main() {
	h1 := &H{
		Handler: http.FileServer(http.Dir("./bind_dst")),
	}
	addr1 := "localhost:8080"
	fileSvr1 := &http.Server{
		Addr:    addr1,
		Handler: h1, // http.FileServer(http.Dir("./bind_dst")),
	}
	log.Printf("[BIND_DST FileServer] Running On: %v", addr1)
	go func() {
		log.Printf("[BIND_DST FileServer] Stop: %v", fileSvr1.ListenAndServe())
	}()

	h2 := &H{
		Handler: http.FileServer(http.Dir("./bind_src_dst")),
	}
	addr2 := "localhost:8081"
	fileSvr2 := &http.Server{
		Addr:    addr2,
		Handler: h2, // http.FileServer(http.Dir("./bind_src_dst")),
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
