# Gemstone Redmine Theme
🎨 Customizable, free and open-source Redmine theme.  
UI/UX by [Tabler UI Kit](https://tabler.io/)

## Configuration
- `targetVersion`: Version for which config has been built
- `debug` (bool): Is debug mode?
- `color` (string): Primary color, see https://preview.tabler.io/docs/colors.html
- `logo` (string): URL of the logo to display
- `menuIcons`: Tabler Icons for the different menu items, see https://tabler-icons.io/

## Setup Readmine with Docker
docker network create redmine-network
docker run --name redmine-db --network redmine-network -e POSTGRES_USER=redmine -e POSTGRES_PASSWORD=xxx -p 5432:5432 -d postgres
docker run -d --name redmine --network redmine-network -p 3000:3000 -v ~/workspace/gemstone/dist:/usr/src/redmine/public/themes/tabler -e REDMINE_DB_POSTGRES=redmine-db -e REDMINE_DB_USERNAME=redmine -e REDMINE_DB_PASSWORD=xxx redmine

## Sources
WebContainers: https://github.com/sveltejs/learn.svelte.dev  
Start carver with VSCode Live Server:
- https://github.com/ritwickdey/vscode-live-server/issues/657#issuecomment-959848707
- https://stackoverflow.com/a/72999996/11787313