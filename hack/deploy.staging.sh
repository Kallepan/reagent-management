#!/bin/bash

export $(grep -v '^#' .staging.env | xargs)

echo $DOCKER_REGISTRY_PASSWORD | docker login --username $DOCKER_REGISTRY_USERNAME --password-stdin

kubectl create namespace $NAMESPACE --kubeconfig=$KUBECONFIG

kubectl delete secret secrets -n $NAMESPACE --kubeconfig=$KUBECONFIG
kubectl create secret generic secrets -n $NAMESPACE \
    --from-env-file=.staging.env \
    --kubeconfig=$KUBECONFIG
kubectl delete secret regcred -n $NAMESPACE --kubeconfig=$KUBECONFIG
kubectl create secret docker-registry -n $NAMESPACE \
    regcred \
    --docker-server=$DOCKER_REGISTRY_SERVER \
    --docker-username=$DOCKER_REGISTRY_USERNAME \
    --docker-password=$DOCKER_REGISTRY_PASSWORD \
    --kubeconfig=$KUBECONFIG

# Delete deployments
kubectl delete deployment rms-backend -n $NAMESPACE --kubeconfig=$KUBECONFIG
kubectl delete deployment rms-db -n $NAMESPACE --kubeconfig=$KUBECONFIG
kubectl delete deployment rms-frontend -n $NAMESPACE --kubeconfig=$KUBECONFIG

cd backend
docker build -t $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY-backend:${VERSION} .
docker push $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY-backend:${VERSION}

cd ../frontend
docker build -t $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY-frontend:${VERSION} .
docker push $DOCKER_REGISTRY_USERNAME/$DOCKER_REGISTRY_REPOSITORY-frontend:${VERSION}

cd ../infrastructure/staging
kubectl kustomize . > run.yaml
sed -i "s/IMAGE_TAG/${VERSION}/g" run.yaml
kubectl apply -f run.yaml --kubeconfig=$KUBECONFIG
