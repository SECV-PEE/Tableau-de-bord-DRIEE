import pandas as pd


def get_nom_epci(code):
    return list_epci.loc[list_epci["EPCI"] == code]["LIBEPCI"].unique()[0]

def get_epci(commune):
    return list_epci.loc[list_epci["CODGEO"] == commune]["EPCI"].unique()[0]

list_epci = pd.read_csv("liste_communes_EPCI.csv") #this path is the one used by the "working-directory" rule in github actions file '.github/workflows/run_python.yml'
donnees = pd.read_csv("AIRPARIF_conso.csv")

annee = donnees["annee"].unique()
epci = list_epci["EPCI"].unique()
secteurs = donnees["secteur"].unique()
energie = donnees["energie"].unique()

epci_nom = dict()
for i in epci:
    epci_nom[str(i)] = get_nom_epci(i)

donnees["epci"] = donnees.apply(lambda x: get_epci(x.code_insee), axis=1)


annee_n = list()
epci_n = list()
nom_epci_n = list()
secteur_n = list()
energie_n = list()
consomm_n_reelle = list()
consomm_n_normal = list()

for a in annee:
    annee_filter = donnees[donnees["annee"] == a]
    for e in epci:
        epci_filter = annee_filter[annee_filter["epci"] == e]
        for sect in secteurs:
            sec_filter = epci_filter[epci_filter["secteur"] == sect]
            for eng in energie:
                eng_filter = sec_filter[sec_filter["energie"] == eng]
                consom_finale_reelle = eng_filter.sum(axis=0,skipna=True)["conso_reel_mwh"]
                consom_finale_normal = eng_filter.sum(axis=0,skipna=True)["conso_normal_mwh"]
                annee_n.append(a)
                epci_n.append(e)
                secteur_n.append(sect)
                energie_n.append(eng)
                consomm_n_reelle.append(consom_finale_reelle)
                consomm_n_normal.append(consom_finale_normal)
                nom_epci_n.append(get_nom_epci(e))

energie_n = [eng.replace("PP + CMS","PP_CMS") for eng in energie_n]
epci_donnees = {"annee": annee_n, "epci": epci_n, "nom_epci": nom_epci_n,
                "secteur": secteur_n, "energie": energie_n, "consommation": consomm_n_reelle, "consommation_normale": consomm_n_normal}
df = pd.DataFrame(epci_donnees)
df.to_csv("../../../public/data/page1_consommation/airparif_consommation_epci.csv")
