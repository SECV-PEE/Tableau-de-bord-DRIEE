import pandas as pd


print("traitement_epci_prod")
def get_nom_epci(code):
    return list_epci.loc[list_epci["EPCI"] == code]["LIBEPCI"].unique()[0]

def get_epci(commune):
    return list_epci.loc[list_epci["CODGEO"] == commune]["EPCI"].unique()[0]

list_epci = pd.read_csv("liste_communes_EPCI.csv")
donnees = pd.read_csv("production_elec_communale.csv")

annee = donnees["annee"].unique()
epci = list_epci["EPCI"].unique()
sectuers = ["hyd","eol","coge","pv","autres","bionrj"]

epci_nom = dict()
for i in epci:
    epci_nom[str(i)] = get_nom_epci(i)

donnees["epci"] = donnees.apply(lambda x: get_epci(x.insee), axis=1)


annee_n = list()
epci_n = list()
nom_epci_n = list()
secteur_n = list()
nb_site = list()
puissance = list()
production = list()

for a in annee:
    annee_filter = donnees[donnees["annee"] == a]
    for e in epci:
        epci_filter = annee_filter[annee_filter["epci"] == e]
        commune_sum = epci_filter.sum(axis=0,skipna=True)
        autres_nb = commune_sum["autres_btinf36_nb"] + commune_sum["autres_hta_nb"]
        autres_puis = commune_sum["autres_btinf36_puis"] + commune_sum["autres_hta_puis"]
        autres_prod = commune_sum["autres_btinf36_prod"] + commune_sum["autres_hta_prod"]
        bionrj_nb = commune_sum["bionrj_hta_nb"]
        bionrj_puis = commune_sum["bionrj_hta_puis"]
        bionrj_prod = commune_sum["bionrj_hta_prod"]
        coge_nb = commune_sum["coge_btsup36_nb"] + commune_sum["coge_hta_nb"]
        coge_puis = commune_sum["coge_btsup36_puis"] + commune_sum["coge_hta_puis"]
        coge_prod = commune_sum["coge_btsup36_prod"] + commune_sum["coge_hta_prod"]
        eol_nb = commune_sum["eol_btsup36_nb"] + commune_sum["eol_hta_nb"]
        eol_puis = commune_sum["eol_btsup36_puis"] + commune_sum["eol_hta_puis"]
        eol_prod = commune_sum["eol_btsup36_prod"] + commune_sum["eol_hta_prod"]
        hyd_nb = commune_sum["hyd_btinf36_nb"] + commune_sum["hyd_hta_nb"]
        hyd_puis = commune_sum["hyd_btinf36_puis"] + commune_sum["hyd_hta_puis"]
        hyd_prod = commune_sum["hyd_btinf36_prod"] + commune_sum["hyd_hta_prod"]
        pv_nb = commune_sum["pv_btinf36_nb"] + commune_sum["pv_hta_nb"] + commune_sum["pv_btsup36_nb"]
        pv_puis = commune_sum["pv_btinf36_puis"] + commune_sum["pv_hta_puis"]+ commune_sum["pv_btsup36_puis"]
        pv_prod = commune_sum["pv_btinf36_prod"] + commune_sum["pv_hta_prod"]+ commune_sum["pv_btsup36_prod"]

        for s in sectuers:
            annee_n.append(a)
            epci_n.append(e)
            nom_epci_n.append(get_nom_epci(e))
            secteur_n.append(s)
            if s == "hyd":
                nb_site.append(hyd_nb)
                puissance.append(hyd_puis)
                production.append(hyd_prod)
            elif s == "eol":
                nb_site.append(eol_nb)
                puissance.append(eol_puis)
                production.append(eol_prod)
            elif s == "pv":
                nb_site.append(pv_nb)
                puissance.append(pv_puis)
                production.append(pv_prod)
            elif s == "bionrj":
                nb_site.append(bionrj_nb)
                puissance.append(bionrj_puis)
                production.append(bionrj_prod)
            elif s == "autres":
                nb_site.append(autres_nb)
                puissance.append(autres_puis)
                production.append(autres_prod)
            elif s == "coge":
                nb_site.append(coge_nb)
                puissance.append(coge_puis)
                production.append(coge_prod)

epci_donnees = {"annee": annee_n, "epci": epci_n, "non_epci": nom_epci_n,
                "secteur": secteur_n, "nombre_site": nb_site, "puissace": puissance, "production": production}
df = pd.DataFrame(epci_donnees)
df.to_csv("rose_production_epci.csv")









