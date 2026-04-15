# 🔗 Intégration RAG + Angular - Guide Complet

## 📋 Vue d'ensemble

Vous avez maintenant une **architecture complète** :

```
┌─────────────────────────────────┐
│   Angular 21 (port 4200)        │
│   - Composant RagChat           │
│   - Service RagService          │ 
│   - Affichage Q&A + sources     │
└────────────┬────────────────────┘
             │ HTTP
┌────────────▼────────────────────┐
│   FastAPI (port 5000)           │
│   - /api/ask (questions)        │
│   - /api/health (statut)        │
│   - /api/status (infos RAG)     │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   RAG System (Chroma + Ollama)  │
│   - Recherche documents         │
│   - Génération réponses         │
│   - Embeddings                  │
└─────────────────────────────────┘
```

## 🚀 Démarrage du système

### Option 1️⃣: Script automatique (FACILE)
```powershell
cd "C:\Users\Pc\Desktop\ILIA 2-sem2\compagnon ia"
.\start.bat
```
Cela lance **automatiquement** :
- ✅ API RAG sur http://localhost:5000
- ✅ Interface Angular sur http://localhost:4200

### Option 2️⃣: Manuel (pour développement)

Terminal 1 - Vérifier Ollama est actif:
```powershell
ollama serve
```

Terminal 2 - Lancer l'API RAG:
```powershell
cd "C:\Users\Pc\Desktop\ILIA 2-sem2\compagnon ia\rag\Comganon-ia"
python src/api.py
```

Terminal 3 - Lancer Angular:
```powershell
cd "C:\Users\Pc\Desktop\ILIA 2-sem2\compagnon ia\client"
npm start
```

## 🔍 Tester l'intégration

### 1. Ouvrir la page web
```
http://localhost:4200
```

### 2. Vérifier la connexion API
L'interface affiche:
- ✅ **"API connectée"** si tout fonctionne
- ❌ **"API non accessible"** si l'API RAG n'est pas lancée

### 3. Poser une question
```
Exemple: "Qu'est-ce que le machine learning?"
```

**Résultat attendu:**
- La question s'affiche
- Une réponse basée sur le PDF
- 📚 Les sources citées
- ⏱️ Le temps de réponse

## 📁 Structure des fichiers créés

```
client/
├── src/app/
│   ├── services/
│   │   └── rag.service.ts         <- Service HTTP pour l'API
│   ├── features/
│   │   └── rag-chat/
│   │       ├── rag-chat.ts         <- Composant principal
│   │       ├── rag-chat.html       <- Template
│   │       └── rag-chat.css        <- Styles
│   ├── app.ts                      <- App modifiée
│   └── app.html                    <- Template modifié

rag/Comganon-ia/src/
├── api.py                          <- API FastAPI ⭐ NEW

start.bat                           <- Script démarrage ⭐ NEW
```

## 🔌 Endpoints API disponibles

### GET /api/health
Vérifier que l'API fonctionne
```bash
curl http://localhost:5000/api/health
```
Réponse:
```json
{
  "status": "ok",
  "message": "RAG API est opérationnel"
}
```

### POST /api/ask
Poser une question
```bash
curl -X POST http://localhost:5000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Qu'est-ce que le machine learning?", "top_k": 3}'
```

Réponse:
```json
{
  "question": "Qu'est-ce que le machine learning?",
  "answer": "...",
  "sources": ["source1", "source2", "source3"],
  "time": 2.34
}
```

### GET /api/status
Infos du système
```bash
curl http://localhost:5000/api/status
```

## 🛠️ Configuration

### Modifier le port de l'API
Dans `api.py`, ligne finale:
```python
# Port par défaut: 5000
uvicorn.run(app, host="0.0.0.0", port=5000)
```

### Modifier le port d'Angular
```powershell
ng serve --port 4201
```
Puis mettre à jour `rag.service.ts`:
```typescript
private apiUrl = 'http://localhost:5000/api'; // À ajuster si nécessaire
```

### Ajouter plus de modèles Ollama
```powershell
ollama pull mistral
ollama pull neural-chat
```

## ⚠️ Dépannage

### "API non accessible" dans l'interface
1. Vérifier que l'API est lancée: `http://localhost:5000/api/health`
2. Vérifier que Ollama tourne: `ollama serve`
3. Vérifier les logs du terminal Python

### Erreur "CORS blocked"
Vérifier dans `api.py` que 4200 est dans `allow_origins`

### Embeddings lents
- C'est normal la première fois (~30s)
- Document volumineux = plus de chunks = plus de temps
- Optimiser: réduire la taille des chunks dans `embeddings_chroma.py`

### Index Chroma manquant
Relancer l'ingestion:
```powershell
cd "C:\Users\Pc\Desktop\ILIA 2-sem2\compagnon ia\rag\Comganon-ia"
python src/embeddings_chroma.py
```

## 📦 Dépendances installées

**Backend Python:**
- fastapi
- uvicorn
- langchain-community
- chromadb
- ollama

**Frontend Angular:**
- @angular/common
- @angular/forms
- @angular/platform-browser
- rxjs

## 🎯 Prochaines étapes

1. **Upload de PDFs dynamique** - Créer un composant d'upload
2. **Résumés PDF** - Ajouter endpoint `/api/summarize`
3. **Historique persistant** - Sauvegarder en BD
4. **Mode offline** - Intégrer le RAG directement en Angular via Pyodide
5. **Chat multi-tour** - Garder le contexte entre questions

## 📚 Ressources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Angular Documentation](https://angular.io/)
- [LangChain Documentation](https://python.langchain.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)

---

**✅ C'est prêt ! Lancez `.\start.bat` pour commencer ! 🚀**
