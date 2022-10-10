{
  inputs = {
    nixpkgs.url =
      "github:nixos/nixpkgs?rev=07b207c5e9a47b640fe30861c9eedf419c38dce0";
    flake-utils.url =
      "github:numtide/flake-utils?rev=c0e246b9b83f637f4681389ecabcb2681b4f3af0";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.simpleFlake {
      inherit self nixpkgs;
      name = "Package name";

      shell = { pkgs }:
        pkgs.mkShell {
          buildInputs = ([ pkgs.nodejs pkgs.yarn ]
            ++ (if pkgs.stdenv.isDarwin then
              [ ]
            else [
              pkgs.docker
              pkgs.docker-compose
              pkgs.prisma-engines
            ]));
          shellHook = ''
            export PATH="$(pwd)/node_modules/.bin:$PATH"
          '' + (if pkgs.stdenv.isDarwin then ''
            # only on mac
          '' else ''
            # only on linux
            export PRISMA_MIGRATION_ENGINE_BINARY="${pkgs.prisma-engines}/bin/migration-engine"
            export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines}/bin/query-engine"
            export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines}/lib/libquery_engine.node"
            export PRISMA_INTROSPECTION_ENGINE_BINARY="${pkgs.prisma-engines}/bin/introspection-engine"
            export PRISMA_FMT_BINARY="${pkgs.prisma-engines}/bin/prisma-fmt"
          '');yarn
        };

    };
}
