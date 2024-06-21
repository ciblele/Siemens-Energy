package main

import (
    "net/http"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "github.com/confluentinc/confluent-kafka-go/kafka"
)

func main() {
    e := echo.New()

    // Middleware
    e.Use(middleware.Logger())
    e.Use(middleware.Recover())

    // Rota para exibir mensagens
    e.GET("/", func(c echo.Context) error {
        // Lógica para ler a mensagem do Kafka
        // Conexão com Kafka
        c, err := kafka.NewConsumer(&kafka.ConfigMap{
            "bootstrap.servers": "localhost:9092",
            "group.id":          "my-group",
            "auto.offset.reset": "earliest",
        })
        if err != nil {
            return err
        }
        defer c.Close()

        // Inscreva-se no tópico
        c.SubscribeTopics([]string{"meu-topico"}, nil)

        // Leia a próxima mensagem disponível
        msg, err := c.ReadMessage(-1)
        if err != nil {
            return err
        }

        return c.String(http.StatusOK, string(msg.Value))
    })

    // Inicie o servidor
    e.Logger.Fatal(e.Start(":8080"))
}
