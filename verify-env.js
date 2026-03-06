const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Environment Setup...\n');

let allGood = true;

// 1. Check Node.js
try {
    const nodeV = process.version;
    const major = parseInt(nodeV.replace('v', '').split('.')[0], 10);
    if (major < 18) {
        console.error(`❌ Node.js must be v18 or higher (Found ${nodeV})`);
        allGood = false;
    } else {
        console.log(`✅ Node.js: ${nodeV}`);
    }
} catch (e) {
    console.error('❌ Could not determine Node.js version');
    allGood = false;
}

// 2. Check Python
try {
    const pyV = execSync('python --version', { encoding: 'utf-8' }).trim();
    // Simple check for Python 3.10+
    const pyMatch = pyV.match(/Python (\d+)\.(\d+)/);
    if (pyMatch) {
        const major = parseInt(pyMatch[1], 10);
        const minor = parseInt(pyMatch[2], 10);
        if (major < 3 || (major === 3 && minor < 10)) {
            console.error(`❌ Python must be 3.10 or higher (Found ${pyV})`);
            allGood = false;
        } else {
            console.log(`✅ ${pyV}`);
        }
    } else {
        console.log(`✅ Python: ${pyV}`);
    }
} catch (e) {
    console.error('❌ Python is not installed or not in PATH');
    allGood = false;
}

// 3. Check Backend venv
const venvPath = path.join(__dirname, 'backend', 'venv');
if (fs.existsSync(venvPath)) {
    console.log('✅ Backend Virtual Environment: Ready');
} else {
    console.warn('⚠️ Backend Virtual Environment: Missing (Run "npm run setup:backend")');
    allGood = false;
}

// 4. Check Frontend node_modules
const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');
if (fs.existsSync(frontendNodeModules)) {
    console.log('✅ Frontend Dependencies: Ready');
} else {
    console.warn('⚠️ Frontend Dependencies: Missing (Install with "cd frontend && npm install")');
    allGood = false;
}

// 5. Check Root node_modules
const rootNodeModules = path.join(__dirname, 'node_modules');
if (fs.existsSync(rootNodeModules)) {
    console.log('✅ Root Dependencies: Ready');
} else {
    console.warn('⚠️ Root Dependencies: Missing (Install with "npm install")');
    allGood = false;
}

// 6. Check Database
const dbPath = path.join(__dirname, 'backend', 'db.sqlite3');
if (fs.existsSync(dbPath)) {
    console.log('✅ Database: Ready');
} else {
    console.warn('⚠️ Database: Missing (Run "npm run setup:backend")');
    allGood = false;
}

console.log('');
if (allGood) {
    console.log('🎉 Everything looks good! You are ready to run "npm run dev".');
} else {
    console.error('🛑 Please fix the warnings/errors above before starting the project.');
    process.exit(1);
}
