-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mar. 07 mars 2023 à 10:47
-- Version du serveur :  5.7.24
-- Version de PHP :  7.2.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `daily_stock_mini`
--

-- --------------------------------------------------------

--
-- Structure de la table `appro`
--

DROP TABLE IF EXISTS `appro`;
CREATE TABLE IF NOT EXISTS `appro` (
  `id_appro` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_appro` date NOT NULL,
  `id_user` smallint(5) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_appro`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `depense`
--

DROP TABLE IF EXISTS `depense`;
CREATE TABLE IF NOT EXISTS `depense` (
  `id_depense` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `libelle` varchar(255) NOT NULL,
  `montant` int(11) NOT NULL,
  `date_depense` date NOT NULL,
  `id_user` smallint(5) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_depense`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_appro`
--

DROP TABLE IF EXISTS `ligne_appro`;
CREATE TABLE IF NOT EXISTS `ligne_appro` (
  `id_produit` int(11) UNSIGNED NOT NULL,
  `id_appro` bigint(20) UNSIGNED NOT NULL,
  `quantite` int(11) UNSIGNED NOT NULL,
  KEY `id_produit` (`id_produit`),
  KEY `id_appro` (`id_appro`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_vente`
--

DROP TABLE IF EXISTS `ligne_vente`;
CREATE TABLE IF NOT EXISTS `ligne_vente` (
  `id_vente` bigint(20) UNSIGNED NOT NULL,
  `id_produit` int(11) UNSIGNED NOT NULL,
  `quantite` int(11) UNSIGNED NOT NULL,
  KEY `id_vente` (`id_vente`),
  KEY `id_produit` (`id_produit`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

DROP TABLE IF EXISTS `produit`;
CREATE TABLE IF NOT EXISTS `produit` (
  `id_produit` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `libelle` varchar(150) NOT NULL,
  `stock_min` int(11) NOT NULL,
  `prix_achat` int(11) DEFAULT NULL,
  `prix_vente` int(11) DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `id_user` smallint(5) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_produit`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `stock`
--

DROP TABLE IF EXISTS `stock`;
CREATE TABLE IF NOT EXISTS `stock` (
  `id_stock` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `quantite` int(11) UNSIGNED NOT NULL,
  `id_produit` int(11) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_stock`),
  KEY `id_produit` (`id_produit`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id_user` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `login` varchar(45) NOT NULL,
  `pass` varchar(45) NOT NULL,
  `nom_boutique` varchar(255) NOT NULL,
  `type_boutique` varchar(100) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `vente`
--

DROP TABLE IF EXISTS `vente`;
CREATE TABLE IF NOT EXISTS `vente` (
  `id_vente` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_vente` datetime NOT NULL,
  `id_user` smallint(5) UNSIGNED NOT NULL,
  PRIMARY KEY (`id_vente`),
  KEY `id_user` (`id_user`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
