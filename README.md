
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f17bb7a1-677e-48f9-9788-57f3494140be

## How to edit sections

The website content is managed through both the Supabase database and the `src/config/sections.yml` file.

### Hero Section Titles
The titles that appear in the hero section animation are managed through the Supabase database. To update them:

1. Access your Supabase dashboard
2. Navigate to the Table Editor
3. Select the `hero_titles` table
4. Here you can:
   - Add new titles by inserting new rows
   - Modify existing titles by updating their text or weights
   - Change the order of titles by updating the `sort_order` column
   - Delete titles you no longer want to display

Each title can have custom font weights applied to different words. The weights are stored as an array of Tailwind classes (e.g., `['font-thin', 'font-medium']`).

### Portfolio Projects
The portfolio section is managed through the Supabase database. To update projects:

1. Access your Supabase dashboard
2. Navigate to the Table Editor
3. Select the `projects` table
4. Here you can:
   - Add new projects
   - Update existing project details
   - Change the order of projects using the `sort_order` column
   - Update project images by providing new URLs

Each project requires:
- A title
- A category
- A description
- A hero image URL
- Additional images (optional)

### Other Sections
The remaining website content is managed through the `sections` table in Supabase:

1. Access your Supabase dashboard
2. Navigate to the Table Editor
3. Select the `sections` table
4. Here you can update:
   - About section: title, description, and portfolio URL
   - Contact section: title, description, and "get in touch" text
   - Other custom sections

Each section in the database includes:
- A unique section name
- A title
- A description
- Additional fields specific to that section (e.g., portfolio_url for the About section)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f17bb7a1-677e-48f9-9788-57f3494140be) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f17bb7a1-677e-48f9-9788-57f3494140be) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

