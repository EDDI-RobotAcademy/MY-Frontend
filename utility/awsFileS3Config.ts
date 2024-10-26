import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { S3Client } from "@aws-sdk/client-s3";

export const useAwsS3Config = () => {
    const config = useRuntimeConfig();

    const REGION = config.public.AWS_REGION as string; // 리전 설정
    const IDENTITY_POOL_ID = config.public.AWS_S3_IDENTITY_POOL as string; // Identity Pool ID

    if (!REGION || !IDENTITY_POOL_ID) {
        throw new Error("Missing required environment variables for AWS configuration");
    }

    const s3Client = new S3Client({
        region: REGION,
        credentials: fromCognitoIdentityPool({
            identityPoolId: IDENTITY_POOL_ID,
            clientConfig: { region: REGION },
        }),
    });

    return {
        s3Client,
        REGION,
        IDENTITY_POOL_ID
    }
}