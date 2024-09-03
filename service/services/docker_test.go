package services_test

import (
	"context"
	"testing"

	"github.com/camilojm27/trabajo-de-grado/service/services/docker"

	ty "github.com/camilojm27/trabajo-de-grado/service/types"
)

func TestCreateDeleteInspectContainer(t *testing.T) {

	ctx := context.Background()
	containerName := "test_container"

	data := ty.ContainerRequest{
		Action: "",
		PID:    "",
		Data: &ty.ContainerRequestData{
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

	// Test if a container can be created

	_, err := docker.Create(ctx, data)
	if err != nil {
		t.Fatalf("Error al crear el contenedor de prueba: %v", err)
	}

	// Test if a container can be inspected
	_, err = docker.Inspect(ctx, containerName)
	if err != nil {
		t.Error("El contenedor no se eliminó correctamente")
	}
	// Test if a container can be deleted

	_, err = docker.Delete(ctx, containerName)

	if err != nil {
		t.Errorf("Error al eliminar el contenedor: %v", err)
	}

	// Test if a container deleted returns an error when inspected
	_, err = docker.Inspect(ctx, containerName)
	if err == nil {
		t.Error("El contenedor no se eliminó correctamente")
	}
}
