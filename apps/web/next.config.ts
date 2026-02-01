import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	transpilePackages: ['@vibe-todos/shared'],
};

export default nextConfig;
