import pandas as pd


print("traitement_epci_emission")
def get_nom_epci(code):
    return list_epci.loc[list_epci["EPCI"] == code]["LIBEPCI"].unique()[0]

def get_epci(commune):
    return list_epci.loc[list_epci["CODGEO"] == commune]["EPCI"].unique()[0]

list_epci = pd.read_csv("liste_communes_EPCI.csv")
donnees = pd.read_csv("airparif_emission_GES.csv", dtype={'annee':str,'insee':str})

annee = donnees["annee"].unique()
epci = list_epci["EPCI"].unique()
secteurs = ["Agriculture","Residentiel","Industrie","Tertiaire","Totale",
"Transport_R","Transport_A","Production-Energie"]

epci_nom = dict()
for i in epci:
    epci_nom[str(i)] = get_nom_epci(i)

donnees["epci"] = donnees.apply(lambda x: get_epci(int(x.insee)), axis=1)


annee_n = list()
epci_n = list()
nom_epci_n = list()
secteur_n = list()
emission = list()

for a in annee:
    annee_filter = donnees[donnees["annee"] == a]
    for e in epci:
        epci_filter = annee_filter[annee_filter["epci"] == e]
        for s in secteurs:
            sec_filter = epci_filter[epci_filter["secteur"] == s]
            filter_sum = sec_filter.sum(axis=0,skipna=True)["emission"]
            annee_n.append(a)
            epci_n.append(e)
            nom_epci_n.append(get_nom_epci(e))
            if s == "Production-Energie":
            	secteur_n.append("Production_Energie")
            else: secteur_n.append(s)
            emission.append(filter_sum)

print("emission")
print(emission)
epci_donnees = {"annee": annee_n, "epci": epci_n, "epci_nom": nom_epci_n,
                "secteur": secteur_n, "emission": emission}
df = pd.DataFrame(epci_donnees)
df.to_csv("airparif_emission_epci.csv")









