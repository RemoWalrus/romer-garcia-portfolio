
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f17bb7a1-677e-48f9-9788-57f3494140be

## SEO Optimization

The website has been optimized for search engines with the following metadata:

- **Title**: Romer Garcia | Strategic Thinker | Design Innovator | Digital Media Leader
- **Description**: STRATEGIC THINKER | DESIGN INNOVATOR | DIGITAL MEDIA LEADER. Accomplished Design Lead and Multimedia Designer with a proven track record of leading high-impact digital campaigns and brand transformations. Known as a visionary problem solver, seamlessly blending strategy, creativity, and technology to craft compelling visual narratives.
- **Keywords**: Design Lead, Multimedia Designer, Digital Media, Brand Transformation, Visual Narrative, Creative Strategy, Digital Campaigns
- **Open Graph Tags**: Included for better social media sharing
- **Twitter Card Tags**: Included for Twitter sharing

## How to edit sections

The website content is managed through the Supabase database. Each section's content can be updated through the sections table.

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
- External URL (optional)
- YouTube URL (optional)

### Gallery Section
The gallery section displays images in a horizontal filmstrip layout. To manage the gallery:

1. Access your Supabase dashboard
2. Navigate to the Table Editor
3. Select the `gallery` table
4. Here you can:
   - Add new images by inserting new rows
   - Add optional titles to images
   - Add optional descriptions that will appear in the modal view
   - Change the order of images using the `sort_order` column
   - Update image URLs
   
The gallery displays images in a horizontal filmstrip layout with navigation arrows. Each image can be clicked to view it in a larger modal, which will display the title and description (if provided).

### Contact Section
- Title
- Description
- "Get in touch" text

### Social Media Links
Social media links are managed through the Supabase database and are displayed in the footer on both desktop and mobile devices. To update the social media links:

1. Access your Supabase dashboard
2. Navigate to the Table Editor
3. Select the `sections` table
4. Find the row with `section_name = 'social'`
5. Update the following fields as needed:
   - facebook_url
   - twitter_url
   - linkedin_url
   - instagram_url
   - youtube_url

The social media links will be displayed in the footer across all device sizes.

### Other Sections
The remaining website content is managed through the `sections` table in Supabase:

1. Access your Supabase dashboard
2. Navigate to the Table Editor
3. Select the `sections` table
4. Here you can update various sections:

#### About Section
- Title
- Description
- Portfolio URL
- Button text for the portfolio download

#### Contact Section
- Title
- Description
- "Get in touch" text

#### Quote Section
- Quote text
- Author

Each section in the database includes:
- A unique section name
- Required fields based on the section type
- Default values for important fields to prevent null values

## Deployment to GitHub Pages

To deploy your site to GitHub Pages:

1. Make sure your repository is pushed to GitHub.

2. In your repository settings on GitHub:
   - Go to the "Pages" section
   - Under "Source", select "GitHub Actions"

3. The repository already includes a GitHub Actions workflow file (`.github/workflows/static.yml`) that handles the deployment process.

4. Each time you push changes to the main branch, GitHub Actions will automatically:
   - Build your project
   - Deploy it to GitHub Pages
   - Make it available at your GitHub Pages URL (typically `https://[username].github.io/[repository-name]`)

5. You can monitor the deployment status in the "Actions" tab of your repository.

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

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase for backend services

## Additional Features

### Paradoxxia - AI Character Generator

The portfolio includes an interactive AI character generator accessible at `/paradoxxia`. This feature allows users to create unique sci-fi characters using AI image generation.

**Features:**
- Three-step character creation process:
  1. Select species (human, android, robot, mutant, or other)
  2. Choose gender presentation
  3. Enter character name (or generate random names)
- Special "Paradoxxia" easter egg - entering "Paradoxxia" as the character name reveals a pre-designed character with dynamic pose variations
- AI-powered image generation using Lovable AI with Google Gemini models
- Mobile-responsive design with native save-to-photos and share functionality
- Character names with triple X's create "defective" character variants
- Dynamic character descriptions based on species, gender, and name choices
- Supports various character types: humans, androids, robots, mutants, cyborgs, and non-humanoid creatures

**Technical Implementation:**
- Uses Lovable AI Gateway (Google Gemini 2.5 Flash Image Preview) for image generation
- Supabase Edge Functions handle AI requests
- Capacitor integration for native mobile features (save to photos, sharing)
- Circuit board background with animated elements
- Responsive design with mobile-first considerations

### Developer Humor - Meme Page

A fun developer humor page accessible at `/meme` that displays random coding memes, tips, and facts.

**Features:**
- Random meme selection from database
- Each meme includes:
  - Main meme text with attribution
  - Practical coding tip
  - Interesting tech fun fact
- "Another meme" button to refresh content
- Circuit board background matching the site theme
- Responsive design with dark/light mode support

**Technical Implementation:**
- Content managed through Supabase `daily_memes` table
- Uses proxy helper for data fetching
- Fallback memes in case of database errors
- Smooth animations and transitions
- Theme-aware gradient overlays

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f17bb7a1-677e-48f9-9788-57f3494140be) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
