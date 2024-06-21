package main

import (
	"fmt"
	"os"
	"os/signal"

	"github.com/Shopify/sarama"
)

func main() {
	// Configuração do consumidor Kafka
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true

	// Criação do consumidor Kafka
	consumer, err := sarama.NewConsumer([]string{"localhost:9092"}, config)
	if err != nil {
		panic(fmt.Sprintf("Erro ao criar o consumidor: %v", err))
	}
	defer func() {
		if err := consumer.Close(); err != nil {
			fmt.Printf("Erro ao fechar o consumidor: %v\n", err)
		}
	}()

	// Tópico a ser consumido
	topic := "ogtech"
	partitionConsumer, err := consumer.ConsumePartition(topic, 0, sarama.OffsetOldest)
	if err != nil {
		panic(fmt.Sprintf("Erro ao abrir a partição do consumidor: %v", err))
	}
	defer func() {
		if err := partitionConsumer.Close(); err != nil {
			fmt.Printf("Erro ao fechar a partição do consumidor: %v\n", err)
		}
	}()

	// Captura de sinais para encerrar o consumidor corretamente
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	// Processamento das mensagens
	for {
		select {
		case msg := <-partitionConsumer.Messages():
			fmt.Printf("Nova mensagem: %s\n", msg.Value)
		case <-signals:
			fmt.Println("Encerrando...")
			return
		}
	}
}
