# Git Command Cheat Sheet for GeauxCleanup

This is your simple guide to updating your GitHub repository when files change locally.

---

## 🚀 Quick Update (Most Common)

Use these commands when we've made changes and you want to upload everything to GitHub:

```bash
# 1. Navigate to your project folder
cd /Users/czyn/Downloads/boudreaux-cleaning

# 2. Check what files changed (optional, but helpful)
git status

# 3. Add all changed files
git add .

# 4. Save changes with a description
git commit -m "Updated files after working session"

# 5. Upload to GitHub
git push
```

**Copy and paste these commands one at a time into your terminal!**

---

## 📝 Common Commit Messages

Instead of "Updated files after working session", you can use more specific messages:

```bash
git commit -m "Added new booking features"
git commit -m "Fixed admin dashboard bugs"
git commit -m "Updated customer dashboard design"
git commit -m "Added new cleaning service options"
git commit -m "Database updates and improvements"
```

---

## 🔍 Useful Commands to Check Status

### See what files have changed:
```bash
git status
```

### See what changes were made to files:
```bash
git diff
```

### See your recent commits:
```bash
git log --oneline -5
```
(Shows last 5 commits)

---

## 📥 Getting Latest Changes from GitHub

If you ever make changes directly on GitHub and want to download them to your local folder:

```bash
cd /Users/czyn/Downloads/boudreaux-cleaning
git pull
```

---

## 🆘 Common Issues & Fixes

### Issue: "Please commit your changes or stash them before you merge"
**Solution:**
```bash
git add .
git commit -m "Saving current work"
git pull
```

### Issue: "Permission denied" or authentication error
**Solution:** You may need to set up authentication. Let me know and I'll help!

### Issue: "Nothing to commit, working tree clean"
**Solution:** This means all your files are already up to date on GitHub. No action needed!

---

## 🎯 Step-by-Step Workflow

**Every time we finish working together:**

1. **Open Terminal** (Applications → Utilities → Terminal)

2. **Navigate to project:**
   ```bash
   cd /Users/czyn/Downloads/boudreaux-cleaning
   ```

3. **Check what changed:**
   ```bash
   git status
   ```
   (You'll see a list of modified files in red or green)

4. **Add all changes:**
   ```bash
   git add .
   ```

5. **Commit with a message:**
   ```bash
   git commit -m "Describe what we worked on today"
   ```

6. **Push to GitHub:**
   ```bash
   git push
   ```

7. **Verify on GitHub:**
   - Go to https://github.com/SyxRoses/GeauxCleanup
   - Refresh the page
   - You should see your latest commit!

---

## 💡 Pro Tips

- **The dot in `git add .`** means "add all changed files"
- **Commit messages** should be short but descriptive
- **Always `git pull`** before starting work if you've made changes on GitHub
- **Don't worry about mistakes** - Git keeps history, so you can always undo things

---

## 🤝 When to Ask for Help

Ask me if:
- You see any error messages you don't understand
- You want to undo something
- You need to work with branches (advanced)
- You want to see the difference between local and GitHub versions

---

## 📌 Quick Reference Card

| What You Want | Command |
|---------------|---------|
| See what changed | `git status` |
| Add all changes | `git add .` |
| Save changes | `git commit -m "message"` |
| Upload to GitHub | `git push` |
| Download from GitHub | `git pull` |
| See recent history | `git log --oneline -5` |

---

**Your Repository:** https://github.com/SyxRoses/GeauxCleanup

**Remember:** You can always ask me to help you run these commands or explain what they do!
