const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/workspace.html", destination: "/workspace", permanent: true },
    ];
  },
};

export default nextConfig;
