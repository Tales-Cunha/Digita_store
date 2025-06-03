{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "digital-store-backend";
  
  buildInputs = with pkgs; [
    # Node.js and package managers
    nodejs
    yarn
    
    # Database systems
    postgresql
    redis
    
    # Development tools
    curl
    jq
    httpie
    
    # Docker for containerization
    docker
    docker-compose
    
    # Testing and development utilities
    #postman
    insomnia
    
    # Code quality and formatting
    eslint
    
    # Process management
    pm2
    
    # SSL/TLS certificates for HTTPS
    openssl
    
    # Documentation
    mkdocs
    
    # Build tools
    gnumake
    gcc
  ];

  shellHook = ''
    echo "🚀 Digital Store Backend Development Environment"
    echo "Node.js version: $(node --version)"
    echo "NPM version: $(npm --version)"
    echo "Yarn version: $(yarn --version)"
    echo ""
    echo "Available services:"
    echo "  - PostgreSQL: postgres"
    echo "  - Redis: redis-server"
    echo ""
    echo "Development tools:"
    echo "  - Docker & Docker Compose"
    echo "  - ESLint & Prettier"
    echo "  - HTTPie & cURL for API testing"
    echo ""
    echo "Quick start commands:"
    echo "  npm init -y              # Initialize package.json"
    echo "  npm install express      # Install Express.js"
    echo "  npm install mongoose     # For MongoDB"
    echo "  npm install pg           # For PostgreSQL"
    echo "  npm install redis        # For Redis"
    echo "  npm install stripe       # For payments"
    echo "  npm install passport     # For authentication"
    echo "  npm install jsonwebtoken # For JWT"
    echo "  npm install jest         # For testing"
    echo ""
    
    # Set environment variables for development
    #export NODE_ENV=development
    #export PORT=3000
    #export MONGODB_URI=mongodb://localhost:27017/digital-store
    #export REDIS_URL=redis://localhost:6379
    #export JWT_SECRET=your-jwt-secret-here
    #export STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
    
    # Create project structure if it doesn't exist
    if [ ! -d "src" ]; then
      echo "Creating project structure..."
      mkdir -p {src/{controllers,models,routes,middleware,services,utils},tests,docs,config}
      echo "📁 Project structure created!"
    fi
  '';

  # Environment variables for the development environment
  env = {
    NODE_ENV = "development";
    PORT = "3000";
    MONGODB_URI = "mongodb://localhost:27017/digital-store";
    REDIS_URL = "redis://localhost:6379";
  };
}
