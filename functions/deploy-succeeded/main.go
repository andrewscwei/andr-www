package main

import (
	"context"
	"encoding/json"
	"fmt"

	"utils"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

type RequestBody struct {
	Payload struct {
		AdminURL     string `json:"admin_url"`
		Branch       string `json:"branch"`
		BuildID      string `json:"build_id"`
		CommitRef    string `json:"commit_ref"`
		Committer    string `json:"committer"`
		CommitURL    string `json:"commit_url"`
		Context      string `json:"context"`
		DeployURL    string `json:"deploy_url"`
		ErrorMessage string `json:"error_message"`
		ID           string `json:"id"`
		Name         string `json:"name"`
		SiteID       string `json:"site_id"`
		State        string `json:"state"`
		Title        string `json:"title"`
		URL          string `json:"url"`
	} `json:"payload"`
}

func handler(ctx context.Context, request events.APIGatewayProxyRequest) (*events.APIGatewayProxyResponse, error) {
	requestBody := RequestBody{}
	json.Unmarshal([]byte(request.Body), &requestBody)

	message := fmt.Sprintf("🤖 *DEPLOY SUCCEEDED* for [%s](%s)", utils.EscapeMarkdownV2(requestBody.Payload.Name), utils.EscapeMarkdownV2(requestBody.Payload.URL))
	message += "\n"
	message += fmt.Sprintf("[%s](%s) %s", utils.EscapeMarkdownV2(fmt.Sprintf("[%s]", requestBody.Payload.CommitRef[0:7])), utils.EscapeMarkdownV2(requestBody.Payload.CommitURL), utils.EscapeMarkdownV2(requestBody.Payload.Title))
	message += "\n"
	message += fmt.Sprintf("[@%s](%s) using [Netlify](%s)", utils.EscapeMarkdownV2(requestBody.Payload.Committer), utils.EscapeMarkdownV2(fmt.Sprintf("https://github.com/%s", requestBody.Payload.Committer)), utils.EscapeMarkdownV2(requestBody.Payload.AdminURL))
	message += "\n\n"
	message += fmt.Sprintf("[View](%s)", utils.EscapeMarkdownV2(requestBody.Payload.DeployURL))

	_, err := utils.NotifyOps(message)

	if err != nil {
		return &events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       err.Error(),
		}, nil
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       "OK",
	}, nil
}

func main() {
	lambda.Start(handler)
}
