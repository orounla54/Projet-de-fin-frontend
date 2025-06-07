  } catch (err) {
    setError(null); // Ne plus afficher de message d'erreur
    console.error(err);
  } finally {
    setLoading(false);
  } 