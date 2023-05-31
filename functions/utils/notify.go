package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
)

func notify(message string, token string, chatID string) (resp *http.Response, err error) {
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", token)

	body, _ := json.Marshal(map[string]string{
		"chat_id":                  chatID,
		"text":                     message,
		"parse_mode":               "MarkdownV2",
		"disable_web_page_preview": "true",
	})

	res, err := http.Post(
		url,
		"application/json",
		bytes.NewBuffer(body),
	)

	if err != nil {
		log.Printf("Notifying Telegram... ERR: %s", err)
	} else if res.StatusCode < 200 || res.StatusCode > 299 {
		t, _ := ioutil.ReadAll(res.Body)
		log.Printf("Notifying Telegram... ERR [%d]: %s", res.StatusCode, string(t))
	} else {
		log.Printf("Notifying Telegram... OK [%d]", res.StatusCode)
	}

	return res, err
}

func NotifyOps(message string) (resp *http.Response, err error) {
	token := os.Getenv("TELEGRAM_DEVOPS_BOT_TOKEN")
	chatID := os.Getenv("TELEGRAM_DEVOPS_CHAT_ID")

	return notify(message, token, chatID)
}

func NotifyChat(message string) (resp *http.Response, err error) {
	token := os.Getenv("TELEGRAM_BOT_TOKEN")
	chatID := os.Getenv("TELEGRAM_CHAT_ID")

	return notify(message, token, chatID)
}

func EscapeMarkdownV2(str string) string {
	regex := regexp.MustCompile(`([-_\.#|>\(\)[\]])`)

	return regex.ReplaceAllString(str, `\$1`)
}
