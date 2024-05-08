package services_test

import (
	"context"
	"testing"

	"github.com/camilojm27/trabajo-de-grado/service/services"
	ty "github.com/camilojm27/trabajo-de-grado/service/types"
)

func TestCreateDeleteInspectContainer(t *testing.T) {

	ctx := context.Background()
	containerName := "test_container"

	data := ty.ContainerRequest{
		Action: "",
		PID:    0,
		Data: ty.ContainerRequestData{
			Name:        containerName,
			Image:       "hello-world",
			NodeID:      "",
			ContainerID: "",
			Verified:    false,
			Attributes: ty.ContainerRequestDataAttributes{
				Cmd:           "",
				Env:           nil,
				Volumes:       nil,
				AdvancedBools: nil,
			},
		},
	}

	_, err := services.Create(ctx, data)
	if err != nil {
		t.Fatalf("Error al crear el contenedor de prueba: %v", err)
	}

	_, err = services.Delete(ctx, containerName)

	if err != nil {
		t.Errorf("Error al eliminar el contenedor: %v", err)
	}

	_, err = services.Inspect(ctx, containerName)
	if err == nil {
		t.Error("El contenedor no se eliminó correctamente")
	}
}
