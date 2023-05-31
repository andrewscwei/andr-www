package utils

import (
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
)

func MakeErrorResponse(err error) *events.APIGatewayProxyResponse {
	type Error struct {
		Code    string `json:"code"`
		Message string `json:"message"`
	}

	body, _ := json.Marshal(Error{Code: "", Message: err.Error()})

	return &events.APIGatewayProxyResponse{
		StatusCode: 400,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(body),
	}
}

func MakePayloadResponse(data interface{}) *events.APIGatewayProxyResponse {
	type Payload struct {
		Data interface{} `json:"data"`
	}

	body, err := json.Marshal(Payload{Data: data})

	if err != nil {
		return MakeErrorResponse(err)
	}

	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(body),
	}
}
